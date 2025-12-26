import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripePaymentForm from './StripePaymentForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripePaymentWrapper = ({ amount, onPaymentSuccess, onPaymentError, hotelId, bookingData }) => {
    if (!amount || amount <= 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <p className="text-gray-600">Loading payment details...</p>
            </div>
        );
    }

    const options = {
        mode: 'payment',
        amount: Math.round(amount * 100),
        currency: 'usd',
    };

    return (
        <Elements stripe={stripePromise} options={options}>
            <StripePaymentForm
                amount={amount}
                onPaymentSuccess={onPaymentSuccess}
                onPaymentError={onPaymentError}
                hotelId={hotelId}
                bookingData={bookingData}
            />
        </Elements>
    );
};

export default StripePaymentWrapper;
