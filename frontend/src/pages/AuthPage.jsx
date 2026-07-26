import { useState } from 'react'
import { supabase } from '../supabaseClient'
import toast from 'react-hot-toast'

export default function AuthPage() {
  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [loginIdentifier, setLoginIdentifier] = useState('') // username veya email
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)

  const handleEmailAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (tab === 'login') {
        let loginEmail = loginIdentifier

        // Kullanıcı adıyla giriş yapıyorsa email'e çevir
        if (!loginIdentifier.includes('@')) {
          const { data, error: rpcError } = await supabase.rpc('get_email_by_username', {
            p_username: loginIdentifier
          })
          if (rpcError || !data) {
            throw new Error('This username was not found.')
          }
          loginEmail = data
        }

        const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password })
        if (error) throw error
        toast.success('Welcome back! 🎵')
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { username, free_trial_used: false } }
        })
        if (error) throw error
        toast.success('Your account has been created! Check your email.')
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    localStorage.setItem('google_auth_intent', tab)
    // Kayıt sekmesinde username yazılmışsa sakla
    if (tab === 'register' && username.trim()) {
      localStorage.setItem('pending_username', username.trim())
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/studio',
        queryParams: { prompt: 'select_account' }
      }
    })
    if (error) toast.error(error.message)
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-logo">🎵</div>
          <h1>Tunecraft</h1>
          <p>Professional vocal processing platform. Produce your vocals in the style of your favorite artists.</p>
        </div>
        <div className="auth-features">
          <div className="auth-feature">
            <span className="auth-feature-icon">🎤</span>
            <span>Upload a beat over your vocal, blend it instantly</span>
          </div>
          <div className="auth-feature">
            <span className="auth-feature-icon">🌟</span>
            <span>50+ artist presets (Drake, Travis, Ezhel...)</span>
          </div>
          <div className="auth-feature">
            <span className="auth-feature-icon">🔒</span>
            <span>Your data's security is our top priority</span>
          </div>
          <div className="auth-feature">
            <span className="auth-feature-icon">⚡</span>
            <span>Try it free once, subscribe if you like it</span>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>{tab === 'login' ? 'Welcome back 👋' : 'Create an account 🎶'}</h2>
          <p>{tab === 'login' ? 'Log in to your account' : 'Start with 1 free trial'}</p>

          <div className="auth-tabs">
            <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>Log In</button>
            <button className={`auth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>Sign Up</button>
          </div>

          <form onSubmit={handleEmailAuth}>
            {tab === 'register' && (
              <div className="form-group">
                <label>Username</label>
                <input type="text" placeholder="username" value={username} onChange={e => setUsername(e.target.value)} required />
              </div>
            )}
            <div className="form-group">
              {tab === 'login' ? (
                <>
                  <label>Username or Email</label>
                  <input type="text" placeholder="username or example@email.com" value={loginIdentifier} onChange={e => setLoginIdentifier(e.target.value)} required />
                </>
              ) : (
                <>
                  <label>Email</label>
                  <input type="email" placeholder="example@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </>
              )}
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Please wait...' : (tab === 'login' ? 'Log In' : 'Create Account')}
            </button>
          </form>

          <div className="auth-divider">or</div>

          <button className="btn-google" onClick={handleGoogle}>
            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  )
}
