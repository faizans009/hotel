# Testing the Updated Payment & Booking Flow

## Quick Test Steps

### 1. Open DevTools
```
Press F12 → Go to "Console" tab
Keep console open while testing
```

### 2. Fill Booking Form
- Enter guest name
- Enter email  
- Enter phone number
- Select any room (if required)
- Click **"Continue to Payment"**

### 3. Payment Form Appears
You should see logs like:
```
🔧 StripePaymentForm mounted
🔧 onPaymentSuccess callback exists: true
```

### 4. Enter Test Payment Details
```
Card Number:  4242 4242 4242 4242
Expiry:       12/25
CVC:          123
Name:         Any name
```

### 5. Click "Pay"
Watch the console - you should see logs in this order:

**Step 1: Payment Stored**
```
💾 Storing booking payload to sessionStorage BEFORE payment
💾 Payload stored successfully
```

**Step 2: Payment Confirmed**
```
🎯 stripe.confirmPayment() returned
✅ Payment succeeded!
✅ Payment intent status: succeeded
✅ Calling onPaymentSuccess callback NOW
✅✅ FIRING onPaymentSuccess callback with paymentIntent: pi_xxx
```

**Step 3: Callback Started**
```
=============================================================
🎯🎯🎯 PAYMENT SUCCESS CALLBACK TRIGGERED 🎯🎯🎯
=============================================================
💳 Payment Intent ID: pi_xxx
💳 Payment Status: succeeded
```

**Step 4: Payment Verified**
```
=============================================================
1️⃣ STEP 1: Verifying Payment Status
=============================================================
💳 Payment Status from Stripe: succeeded
✅ Payment Verified! Status: succeeded
```

**Step 5: Booking Data Retrieved**
```
=============================================================
2️⃣ STEP 2: Retrieving Booking Data
=============================================================
✅ Booking payload retrieved and updated with payment intent
```

**Step 6: API Called**
```
=============================================================
3️⃣ STEP 3: Calling Complete Booking API
=============================================================
🚀 COMPLETE BOOKING API CALL STARTED
🚀 Endpoint: POST /api/hotel/booking/finish
🚀 Payload: { user_id: "xxx", ... }
```

**Step 7: API Response**
```
=============================================================
✅ API SUCCESS - Booking Completed
=============================================================
✅ Response Status: 200
✅ Response Data: { booking_id: "xxxx", ... }
```

**Step 8: Complete**
```
=============================================================
✅ BOOKING PROCESS COMPLETE - REMAINING ON SAME PAGE
=============================================================
```

### 6. Verify Result
- ✅ Payment form disappears
- ✅ Success alert shows: "✅ Hotel booked successfully!"
- ✅ You stay on the same page (no navigation)
- ✅ Can see all console logs without errors

---

## If Something Goes Wrong

### Problem: Payment form doesn't appear
**Check Console:**
```
❌ onPaymentSuccess callback exists: false
```
**Solution:** Check if `handlePaymentSuccess` is passed to `StripePaymentWrapper` in BookingForm

---

### Problem: Payment succeeds but callback doesn't fire
**Check Console:**
```
✅ Payment succeeded!
❌❌ onPaymentSuccess callback is NULL or UNDEFINED!
```
**Solution:** The callback prop isn't being passed correctly

---

### Problem: Callback fires but API doesn't get called
**Check Console:**
```
🎯 Payment Success Callback Triggered  ← Yes
3️⃣ Calling Complete Booking API        ← NO
```
**Solution:** SessionStorage might be empty or API function has error

---

### Problem: API called but fails
**Check Console:**
```
🚀 COMPLETE BOOKING API CALL STARTED  ← Yes
❌ API FAILED - Booking Error         ← Here
❌ Status: 400 (or other error code)
```
**Solution:** Check backend API response in Network tab (F12 → Network → booking/finish)

---

## Critical Console Logs to Watch

| Log | Means | Status |
|-----|-------|--------|
| `🔧 onPaymentSuccess callback exists: true` | Callback passed correctly | ✅ Good |
| `💾 Payload stored successfully` | Booking data saved | ✅ Good |
| `✅ Payment succeeded!` | Stripe confirmed payment | ✅ Good |
| `✅✅ FIRING onPaymentSuccess callback` | Callback about to execute | ✅ Good |
| `🎯 Payment Success Callback Triggered` | Callback started | ✅ Good |
| `3️⃣ Calling Complete Booking API` | About to make API call | ✅ Good |
| `✅ API SUCCESS - Booking Completed` | API succeeded | ✅ Good |

If any of these are missing, the flow breaks there.

---

## Network Tab Analysis

To see the actual API calls:

1. Open DevTools (F12)
2. Go to **"Network"** tab
3. Start fresh test
4. During payment, watch for requests:
   - `POST /api/payment/payment-intent` (payment intent creation)
   - `POST /api/hotel/booking/finish` (complete booking API)

Both should show **Status: 200** (or similar success code)

---

## After Successful Booking

You should:
- See success alert
- Stay on same page (no navigation to home)
- Be able to see booking confirmation details on this page
- Or manually navigate to view bookings

