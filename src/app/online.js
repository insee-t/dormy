import { useState } from 'react';

export default function OnlinePage() {
    const [loading, setLoading] = useState(false);

    async function handleCheckout() {
        setLoading(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId: 'price_12345' // ✅ Replace with your real Stripe Price ID
                }),
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url; // ✅ Redirect to Stripe Checkout
            } else {
                alert('Error creating checkout session');
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Failed to initiate checkout.");
        }
        setLoading(false);
    }

    return (
        <div>
            <h1>Online Payment</h1>
            <button onClick={handleCheckout} disabled={loading}>
                {loading ? 'Redirecting...' : 'Start Payment'}
            </button>
        </div>
    );
}
