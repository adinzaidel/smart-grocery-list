"use client";

import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShoppingCart, Check } from 'lucide-react';

const features = [
  'Real-time shared lists with family',
  'AI-powered product recommendations',
  'Smart pantry & expiry tracking',
  'Budget estimation per store',
];

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  return (
    <div className="flex min-h-screen">
      {/* LEFT PANEL */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-14"
        style={{ background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 60%, #4ade80 100%)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <ShoppingCart size={22} color="white" />
          </div>
          <span style={{ color: 'white', fontSize: '1.25rem', fontWeight: 700 }}>Smart Groceries</span>
        </div>
        <div>
          <h1 style={{ color: 'white', fontSize: '3rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1.5rem' }}>
            Shopping,<br />the smart way.
          </h1>
          <p style={{ color: 'rgba(220,252,231,1)', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
            Manage grocery lists, share with family, get AI ideas — all on one clean screen.
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {features.map((f) => (
              <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.9)' }}>
                <span style={{ width: 24, height: 24, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={13} color="white" strokeWidth={3} />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
        <p style={{ color: 'rgba(187,247,208,1)', fontSize: '0.875rem' }}>Trusted by thousands of families every week. 🛒</p>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#f4fbf4' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#111827' }}>
              {mode === 'login' ? 'Welcome back 👋' : 'Create an account'}
            </h2>
            <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
              {mode === 'login' ? 'Log in to your grocery lists.' : 'Sign up and start shopping smarter.'}
            </p>
          </div>

          <div style={{ display: 'flex', padding: '4px', background: '#e8f5e9', borderRadius: '12px', marginBottom: '2rem' }}>
            {(['login', 'signup'] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '10px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.15s', background: mode === m ? '#fff' : 'transparent', color: mode === m ? '#16a34a' : '#6b7280', boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.1)' : 'none' }}>
                {m === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {mode === 'signup' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Full Name</label>
                <input type="text" placeholder="Ada Lovelace" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e5e7eb', borderRadius: '12px', background: '#fff', fontSize: '0.9rem', color: '#1f2937', outline: 'none' }} onFocus={(e) => { e.target.style.borderColor = '#22c55e'; e.target.style.boxShadow = '0 0 0 3px rgba(34,197,94,0.15)'; }} onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
              </div>
            )}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#9ca3af" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1.5px solid #e5e7eb', borderRadius: '12px', background: '#fff', fontSize: '0.9rem', color: '#1f2937', outline: 'none' }} onFocus={(e) => { e.target.style.borderColor = '#22c55e'; e.target.style.boxShadow = '0 0 0 3px rgba(34,197,94,0.15)'; }} onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>Password</label>
                {mode === 'login' && <button onClick={() => {}} style={{ background: 'none', border: 'none', color: '#16a34a', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>Forgot password?</button>}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#9ca3af" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px 44px 12px 42px', border: '1.5px solid #e5e7eb', borderRadius: '12px', background: '#fff', fontSize: '0.9rem', color: '#1f2937', outline: 'none' }} onFocus={(e) => { e.target.style.borderColor = '#22c55e'; e.target.style.boxShadow = '0 0 0 3px rgba(34,197,94,0.15)'; }} onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <button style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(34,197,94,0.35)' }}>
            {mode === 'login' ? 'Log In' : 'Create Account'}
          </button>

          <div style={{ position: 'relative', margin: '1.75rem 0' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}><div style={{ width: '100%', height: 1, background: '#e5e7eb' }} /></div>
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}><span style={{ background: '#f4fbf4', padding: '0 12px', color: '#9ca3af', fontSize: '0.875rem' }}>or continue with</span></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', padding: '12px', border: '1.5px solid #e5e7eb', borderRadius: '12px', background: '#fff', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
              <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
            <button style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', padding: '12px', border: '1.5px solid #e5e7eb', borderRadius: '12px', background: '#fff', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
              <svg style={{ width: 20, height: 20 }} fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.34-.85 3.73-.78 1.63.15 2.94.88 3.76 2.08-3.16 1.88-2.62 5.86.38 7.02-.75 1.83-1.63 3.58-2.95 3.85zm-2.01-14.28c.68-1.08 1.25-2.63.97-4-.89.15-2.52.92-3.4 2.11-.79 1.05-1.42 2.68-1.06 4.14 1.06.1 2.61-.83 3.49-2.25z"/></svg>
              Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
