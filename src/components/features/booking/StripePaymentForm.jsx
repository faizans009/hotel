import React, { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { paymentAPI } from '../../../services/api';

const StripePaymentForm = ({ amount, onPaymentSuccess, onPaymentError, hotelId, bookingData }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [clientSecret, setClientSecret] = useState(null);
    const [error, setError] = useState(null);

    console.log('🔧 StripePaymentForm mounted');
    console.log('🔧 onPaymentSuccess callback exists:', !!onPaymentSuccess);
    console.log('🔧 onPaymentSuccess type:', typeof onPaymentSuccess);
    console.log('🔧 onPaymentError callback exists:', !!onPaymentError);

    useEffect(() => {
        const initializePayment = async () => {
            try {
                const response = await paymentAPI.createPaymentIntent({
                    amount: amount,
                    currency: 'usd',
                    metadata: {
                        hotelId: hotelId,
                        bookingDate: new Date().toISOString()
                    }
                });

                if (response.data?.success) {
                    setClientSecret(response.data.clientSecret);
                } else {
                    setError('Failed to initialize payment');
                }
            } catch (err) {
                setError('Payment initialization failed: ' + err.message);
            }
        };

        if (amount > 0) {
            initializePayment();
        }
    }, [amount, hotelId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            const { error: submitError } = await elements.submit();
            if (submitError) {
                setError(submitError.message);
                if (onPaymentError) {
                    onPaymentError(submitError);
                }
                setIsProcessing(false);
                return;
            }

            // STORE BOOKING PAYLOAD BEFORE PAYMENT
            if (bookingData?.bookingPayload) {
                console.log('💾 Storing booking payload to sessionStorage BEFORE payment');
                console.log('💾 Payload to store:', bookingData.bookingPayload);
                sessionStorage.setItem('pendingBookingPayload', JSON.stringify(bookingData.bookingPayload));
                console.log('💾 Payload stored successfully');
                console.log('💾 Verification - stored payload:', sessionStorage.getItem('pendingBookingPayload'));
            }

            const result = await stripe.confirmPayment({
                elements,
                clientSecret,
                confirmParams: {
                    return_url: `${window.location.origin}/booking/confirmation`,
                    payment_method_data: {
                        billing_details: {
                            name: bookingData?.guestName || 'Guest',
                            email: bookingData?.email || '',
                        }
                    }
                },
                redirect: 'if_required' // Don't redirect automatically, we'll handle it
            });

            console.log('🎯 stripe.confirmPayment() returned');
            console.log('🎯 Stripe Result object:', result);

            if (result.error) {
                console.error('🛑 Payment error detected!');
                console.error('🛑 result.error:', result.error);
                setError(result.error.message);
                if (onPaymentError) {
                    console.log('🛑 Calling onPaymentError callback');
                    onPaymentError(result.error);
                }
                setIsProcessing(false);
            } else if (result.paymentIntent && (result.paymentIntent.status === 'succeeded' || result.paymentIntent.status === 'processing')) {
                console.log('✅ Payment succeeded!');
                console.log('✅ Payment intent status:', result.paymentIntent.status);
                console.log('✅ Payment intent ID:', result.paymentIntent.id);
                console.log('✅ Payment intent object:', result.paymentIntent);
                console.log('✅ Calling onPaymentSuccess callback NOW');
                console.log('✅ onPaymentSuccess callback exists:', !!onPaymentSuccess);
                console.log('✅ onPaymentSuccess callback type:', typeof onPaymentSuccess);

                // CALL THE CALLBACK IMMEDIATELY - success!
                if (onPaymentSuccess) {
                    console.log('✅✅ FIRING onPaymentSuccess callback with paymentIntent:', result.paymentIntent.id);
                    console.log('✅✅ This should trigger handlePaymentSuccess in BookingForm');
                    console.log('✅✅ About to call: onPaymentSuccess(result.paymentIntent)');
                    onPaymentSuccess(result.paymentIntent);
                    console.log('✅✅ onPaymentSuccess callback executed - SHOULD SEE THIS!');
                } else {
                    console.error('❌❌ onPaymentSuccess callback is NULL or UNDEFINED!');
                }
            } else {
                console.log('⚠️ Payment intent received but status unknown');
                console.log('⚠️ Payment intent status:', result.paymentIntent?.status);
                if (onPaymentSuccess) {
                    console.log('⚠️ Calling onPaymentSuccess callback');
                    onPaymentSuccess(result.paymentIntent);
                }
            }
        } catch (err) {
            setError('Payment processing failed: ' + err.message);
            if (onPaymentError) {
                onPaymentError(err);
            }
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Details</h2>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            {clientSecret && (
                <div className="mb-6">
                    <PaymentElement />
                </div>
            )}

            <button
                type="submit"
                disabled={isProcessing || !clientSecret || !stripe || !elements}
                style={{ backgroundColor: '#0057FF' }}
                className="w-full hover:opacity-90 !text-white font-semibold py-3 px-8 rounded-lg transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isProcessing ? 'Processing Payment...' : `Pay $${parseFloat(amount).toFixed(2)}`}
            </button>
        </form>
    );
};

export default StripePaymentForm;
