import React from 'react';

export default function MarketplaceHome() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', backgroundColor: '#0B0B0F', color: '#FFF', minHeight: '100vh' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', color: '#FF3366', fontWeight: 'bold' }}>Eventlit</h1>
        <p style={{ color: '#A0A0AB' }}>Hyper-Scale Ticketing Ecosystem Powered by Monad Network</p>
      </header>
      
      <section style={{ border: '1px solid #27272A', padding: '1.5rem', borderRadius: '8px' }}>
        <h2>Trending Flash Ticket Drops</h2>
        <p style={{ color: '#71717A' }}>Parallel transaction routing handling up to 10,000 requests per second securely.</p>
        <button style={{ backgroundColor: '#FF3366', color: '#FFF', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Enter Queue holding room
        </button>
      </section>
    </main>
  );
}
