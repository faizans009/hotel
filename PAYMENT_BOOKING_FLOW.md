# Payment & Booking Flow - Updated

## Overview
The payment and booking process now follows a **verify-then-book** pattern:

```
1. Create Payment Intent
   ↓
2. User Fills Data & Pays
   ↓
3. ✅ Verify Payment Confirmed
   ↓
4. Call Complete Booking API
   ↓
5. Stay on Same Page (No Navigation)
```

---

## Step-by-Step Flow

### 1. **Create Payment Intent** (Payment Form Loads)
- **File:** `StripePaymentForm.jsx`
- **Action:** `useEffect` calls `paymentAPI.createPaymentIntent()`
- **Purpose:** Get `clientSecret` from backend for Stripe

```javascript
const response = await paymentAPI.createPaymentIntent({
    amount: amount,
    currency: 'usd',
    metadata: { hotelId, bookingDate }
});
setClientSecret(response.data.clientSecret);
```

---

### 2. **Store Booking Data (Before Payment)**
- **File:** `StripePaymentForm.jsx` - `handleSubmit()`
- **Action:** Before calling `stripe.confirmPayment()`, store booking payload in sessionStorage
- **Why:** Data persists across payment processing

```javascript
if (bookingData?.bookingPayload) {
    sessionStorage.setItem('pendingBookingPayload', 
        JSON.stringify(bookingData.bookingPayload));
}
```

---

### 3. **User Enters Card & Clicks "Pay"**
- **File:** `StripePaymentForm.jsx` - `handleSubmit()`
- **Action:** Call `stripe.confirmPayment()`
- **Key Setting:** `redirect: 'if_required'` 
  - Prevents auto-redirect to success page
  - Returns control to callback

```javascript
const result = await stripe.confirmPayment({
    elements,
    clientSecret,
    confirmParams: { /* ... */ },
    redirect: 'if_required'  // ← Important!
});
```

---

### 4. **Verify Payment Status** (Critical Step)
- **File:** `StripePaymentForm.jsx` - Check payment status
- **Condition:** Must be `'succeeded'` OR `'processing'`
- **Action:** If verified, call the `onPaymentSuccess` callback

```javascript
if (result.paymentIntent && 
    (result.paymentIntent.status === 'succeeded' || 
     result.paymentIntent.status === 'processing')) {
    
    console.log('✅ Payment Verified! Status:', result.paymentIntent.status);
    
    if (onPaymentSuccess) {
        onPaymentSuccess(result.paymentIntent);  // ← Trigger callback
    }
}
```

---

### 5. **Handle Payment Success Callback** (Booking Completion)
- **File:** `BookingForm.jsx` - `handlePaymentSuccess()`
- **Action:** 
  1. Verify payment status again
  2. Get booking data from sessionStorage
  3. Add payment intent ID to payload
  4. Call Complete Booking API
  5. Clear sessionStorage
  6. Stay on same page

```javascript
const handlePaymentSuccess = async (paymentIntent) => {
    console.log('🎯 Payment Success Callback Triggered');
    
    // Step 1: Verify payment
    if (paymentIntent.status !== 'succeeded' && 
        paymentIntent.status !== 'processing') {
        throw new Error('Payment not confirmed');
    }
    
    // Step 2: Get booking data
    const bookingPayload = JSON.parse(
        sessionStorage.getItem('pendingBookingPayload')
    );
    
    // Step 3: Add payment intent ID
    bookingPayload.paymentIntentId = paymentIntent.id;
    bookingPayload.paymentMethod = 'stripe';
    
    // Step 4: Call API
    const response = await hotelAPI.CompleteBooking(bookingPayload);
    
    // Step 5: Clear storage
    sessionStorage.removeItem('pendingBookingPayload');
    
    // Step 6: Stay on page
    setShowPayment(false);  // Hide payment form
    alert('✅ Hotel booked successfully!');
};
```

---

### 6. **Complete Booking API Call**
- **File:** `api.js` - `CompleteBooking()`
- **Endpoint:** `POST /api/hotel/booking/finish`
- **Payload Includes:**
  - `paymentIntentId` (Stripe confirmation)
  - `order_id` (Pre-booking ID)
  - `user_id`, `email`, `phone`
  - `rooms` (Room details)
  - `special_requests` (Guest notes)
  - `paymentMethod: 'stripe'`

```javascript
CompleteBooking: (data) => {
    console.log('🚀 API Call: POST /api/hotel/booking/finish');
    return apiClient.post('/api/hotel/booking/finish', data)
        .then((response) => {
            console.log('✅ Booking Complete!');
            return response;
        });
}
```

---

### 7. **Stay on Same Page** (Final Step)
- **Before:** Navigated to home page
- **Now:** Stay on payment page, show success message
- **Display:** 
  - Hide payment form
  - Show success alert/message
  - Allow user to navigate manually

```javascript
setShowPayment(false);
setTimeout(() => {
    alert('✅ Hotel booked successfully!');
}, 300);

// User can then navigate manually or click "View Bookings"
```

---

## Key Differences from Previous Implementation

| Aspect | Before | Now |
|--------|--------|-----|
| **Post-Payment** | Navigates to success page immediately | Stays on same page |
| **Booking API** | Not called until page loads | Called immediately after payment verification |
| **Verification** | Only success page checked | Payment status verified in callback |
| **Data Storage** | Lost on redirect | Persisted in sessionStorage |
| **User Flow** | Forced navigation | Controlled, can stay on page |

---

## Console Logging (For Debugging)

The code includes detailed logging to track the flow:

```
✅ Payment intent created (Payment form loads)
💾 Booking payload stored to sessionStorage (Before payment)
✅ Payment succeeded! (After card confirmation)
🎯 Payment Success Callback Triggered (Callback starts)
1️⃣ Payment Status Verified
2️⃣ Booking Data Retrieved
3️⃣ Complete Booking API Called
✅✅✅ BOOKING COMPLETED SUCCESSFULLY
✅ BOOKING PROCESS COMPLETE - REMAINING ON SAME PAGE
```

---

## Testing Checklist

- [ ] Open DevTools (F12) → Console tab
- [ ] Fill booking form with guest details
- [ ] Click "Continue to Payment"
- [ ] Payment form appears with card fields
- [ ] Enter test card: `4242 4242 4242 4242`
- [ ] Fill expiry: `12/25`, CVC: `123`
- [ ] Click "Pay"
- [ ] Watch console logs appear in order
- [ ] See "✅ Payment succeeded!" log
- [ ] See "🎯 Payment Success Callback Triggered" log
- [ ] See "3️⃣ Complete Booking API Called" log
- [ ] See "✅✅✅ BOOKING COMPLETED SUCCESSFULLY" log
- [ ] Payment form closes
- [ ] Success alert appears
- [ ] Remain on booking page (no navigation)

---

## Error Handling

If anything fails, you'll see:
- Red error message in payment form
- `❌ Payment Error` console log
- Booking not completed
- Can retry payment

Common errors:
- `Payment not confirmed` → Card declined
- `Booking data not found` → sessionStorage cleared
- `API Error` → Backend issue
