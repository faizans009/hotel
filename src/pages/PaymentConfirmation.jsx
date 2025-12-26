import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const PaymentConfirmation = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState(null);

    const paymentIntent = searchParams.get('payment_intent');
    const redirectStatus = searchParams.get('redirect_status');

    useEffect(() => {
        if (redirectStatus === 'succeeded') {
            setPaymentStatus('success');
        } else if (redirectStatus === 'processing') {
            setPaymentStatus('processing');
        } else {
            setPaymentStatus('failed');
        }
        setLoading(false);
    }, [redirectStatus]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Processing your payment...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                {paymentStatus === 'success' && (
                    <>
                        <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                        <p className="text-gray-600 mb-2">Your booking has been confirmed.</p>
                        <p className="text-sm text-gray-500 mb-8">Payment Intent: {paymentIntent}</p>

                        <button
                            onClick={() => navigate('/hotels')}
                            className="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-opacity-90 transition"
                        >
                            Back to Hotels
                        </button>
                    </>
                )}

                {paymentStatus === 'processing' && (
                    <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing</h1>
                        <p className="text-gray-600">Your payment is being processed. Please wait...</p>
                    </>
                )}

                {paymentStatus === 'failed' && (
                    <>
                        <div className="text-5xl mb-4">❌</div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
                        <p className="text-gray-600 mb-8">Something went wrong with your payment. Please try again.</p>

                        <button
                            onClick={() => navigate(-1)}
                            className="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-opacity-90 transition"
                        >
                            Try Again
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentConfirmation;
