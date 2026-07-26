import { supabase } from '../supabaseClient'
import toast from 'react-hot-toast'

export default function PaywallPage({ session }) {
  const handleSubscribe = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error('Could not connect to the payment system.')
      }
    } catch {
      toast.error('An error occurred, please try again.')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="paywall-page">
      <div className="paywall-card">
        <div className="paywall-icon">🔐</div>
        <h2>Your free trial has ended</h2>
        <p>Subscribe to keep using Tunecraft. Unlimited access to all features.</p>

        <div className="plan-box">
          <div className="plan-badge">⭐ Most Popular</div>
          <div className="plan-price">$10<span>/mo</span></div>
          <ul className="plan-features">
            <li>Unlimited audio processing</li>
            <li>50+ artist presets (Drake, Travis, Ezhel, Sagopa...)</li>
            <li>Beat + Vocal mixing studio</li>
            <li>High-quality audio output (WAV / MP3)</li>
            <li>Priority processing queue</li>
            <li>Cancel anytime</li>
          </ul>
        </div>

        <button className="btn-primary" onClick={handleSubscribe}>
          💳 Subscribe Now — $10/mo
        </button>

        <button className="paywall-logout" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  )
}
