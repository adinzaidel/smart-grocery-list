"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Home, Archive, Settings, Plus, Bell, Search, Users, Clock, ChevronRight, LayoutGrid, Star, TrendingUp, Zap, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const lists = [
  { id: 1, name: 'Weekend Groceries', store: 'Rami Levy', items: 12, checked: 4, members: ['A', 'D', 'M'], updated: '1h ago', color: '#22c55e', budget: 320 },
  { id: 2, name: 'Quick Restock', store: 'Victory', items: 4, checked: 0, members: ['A'], updated: '2d ago', color: '#3b82f6', budget: 85 },
  { id: 3, name: 'Monthly Bulk Buy', store: 'Shufersal', items: 28, checked: 10, members: ['A', 'D'], updated: '5h ago', color: '#a855f7', budget: 700 },
];

const navItems = [
  { icon: Home, label: 'Dashboard' },
  { icon: ShoppingCart, label: 'My Lists' },
  { icon: Archive, label: 'Pantry', badge: 3, href: '/pantry' },
  { icon: Star, label: 'Templates' },
  { icon: TrendingUp, label: 'Budget' },
  { icon: Settings, label: 'Settings' },
];

const avatarColors: Record<string, string> = { A: '#3b82f6', D: '#a855f7', M: '#f97316' };

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [search, setSearch] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const filtered = lists.filter((l) => l.name.toLowerCase().includes(search.toLowerCase()) || l.store.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#f4fbf4', fontFamily: 'Inter, Arial, sans-serif' }}>
      {/* SIDEBAR */}
      <aside style={{ display: 'flex', flexDirection: 'column', width: 240, flexShrink: 0, height: '100%', padding: '24px 16px', background: '#ffffff', borderRight: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 8px', marginBottom: 40 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#22c55e,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingCart size={18} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#111827' }}>Smart Groceries</span>
        </div>
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(({ icon: Icon, label, badge, href }: { icon: typeof Home, label: string, badge?: number, href?: string }) => {
            const active = activeNav === label;
            return (
              <button key={label} onClick={() => href ? router.push(href) : setActiveNav(label)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem', background: active ? '#f0fdf4' : 'transparent', color: active ? '#16a34a' : '#6b7280', textAlign: 'left' }}>
                <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
                {label}
                {badge && <span style={{ marginLeft: 'auto', background: '#f97316', color: 'white', borderRadius: 99, padding: '2px 7px', fontSize: '0.7rem', fontWeight: 700 }}>{badge}</span>}
                {active && !badge && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />}
              </button>
            );
          })}
        </nav>
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 8px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>A</div>
            <div><p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1f2937' }}>The Family</p><p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>ada@example.com</p></div>
          </div>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', borderRadius: '8px' }} title="Log out">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', background: '#ffffff', borderBottom: '1px solid #e5e7eb', flexShrink: 0 }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>Good morning, Family! 👋</h1>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: 2 }}>Wednesday, March 18 — Let&apos;s get shopping.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative' }}>
              <Search size={15} color="#9ca3af" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input type="text" placeholder="Search lists..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36, paddingRight: 16, paddingTop: 8, paddingBottom: 8, border: '1.5px solid #e5e7eb', borderRadius: 10, background: '#f9fafb', fontSize: '0.875rem', color: '#374151', outline: 'none', width: 220 }} onFocus={(e) => { e.target.style.borderColor = '#22c55e'; e.target.style.boxShadow = '0 0 0 3px rgba(34,197,94,0.12)'; }} onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
            </div>
            <button style={{ padding: 8, borderRadius: 10, border: 'none', background: 'transparent', cursor: 'pointer', position: 'relative', color: '#6b7280' }}>
              <Bell size={20} />
              <span style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, background: '#f97316', borderRadius: '50%', border: '2px solid white' }} />
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', background: 'linear-gradient(135deg,#22c55e,#16a34a)', border: 'none', borderRadius: 10, color: 'white', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 2px 10px rgba(34,197,94,0.3)' }}>
              <Plus size={16} /> New List
            </button>
          </div>
        </header>

        {/* Scrollable body */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
            {[
              { label: 'Total Lists', value: '3', icon: LayoutGrid, color: '#22c55e', bg: '#f0fdf4' },
              { label: 'Items Pending', value: '36', icon: ShoppingCart, color: '#3b82f6', bg: '#eff6ff' },
              { label: 'Pantry Alerts', value: '3', icon: Clock, color: '#f97316', bg: '#fff7ed' },
              { label: 'Monthly Budget', value: '₪ 1,450', icon: TrendingUp, color: '#a855f7', bg: '#faf5ff' },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={20} color={color} /></div>
                  <ChevronRight size={16} color="#d1d5db" />
                </div>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: 4 }}>{value}</p>
                <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* AI Tip */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', border: '1px solid #bbf7d0', borderRadius: 16, padding: 20, marginBottom: 32 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Zap size={18} color="white" />
            </div>
            <div>
              <p style={{ fontWeight: 600, color: '#166534', marginBottom: 4 }}>AI Tip ✨</p>
              <p style={{ fontSize: '0.9rem', color: '#15803d' }}>Your milk and eggs in the pantry expire in 2 days. Add them to your Weekend Groceries list? <button style={{ background: 'none', border: 'none', color: '#166534', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>Add now</button></p>
            </div>
          </div>

          {/* Lists header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>My Lists</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              {['All Lists', 'Supermarkets', 'Templates'].map((tab, i) => (
                <button key={tab} style={{ padding: '6px 16px', borderRadius: 8, border: i === 0 ? 'none' : '1px solid #e5e7eb', background: i === 0 ? '#22c55e' : '#fff', color: i === 0 ? '#fff' : '#6b7280', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>{tab}</button>
              ))}
            </div>
          </div>

          {/* List Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {filtered.map((list) => {
              const progress = Math.round((list.checked / list.items) * 100);
              return (
                <div key={list.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: '24px', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, background: list.color, borderRadius: '16px 0 0 16px' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <h3 style={{ fontWeight: 700, color: '#1f2937', fontSize: '1rem' }}>{list.name}</h3>
                      <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: 2 }}>🏪 {list.store}</p>
                    </div>
                    <span style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: 99 }}>{list.items} items</span>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9ca3af', marginBottom: 6 }}>
                      <span>{list.checked} checked</span><span>{progress}%</span>
                    </div>
                    <div style={{ height: 8, background: '#f3f4f6', borderRadius: 99 }}>
                      <div style={{ height: '100%', width: `${progress}%`, background: list.color, borderRadius: 99, transition: 'width 0.3s' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: -6 }}>
                      {list.members.map((m) => <div key={m} style={{ width: 28, height: 28, borderRadius: '50%', background: avatarColors[m] ?? '#9ca3af', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'white', marginRight: -6 }}>{m}</div>)}
                      <button style={{ width: 28, height: 28, borderRadius: '50%', background: '#f3f4f6', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginRight: -6 }}><Users size={11} color="#9ca3af" /></button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: '#9ca3af' }}><Clock size={11} />{list.updated}</div>
                  </div>
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Est. Budget</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151' }}>₪ {list.budget}</span>
                  </div>
                </div>
              );
            })}
            <div style={{ background: 'transparent', border: '2px dashed #d1d5db', borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, cursor: 'pointer', minHeight: 200 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={24} color="#22c55e" /></div>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#9ca3af' }}>Create New List</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
