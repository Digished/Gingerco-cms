import React from 'react'

export const Logo = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <span
        style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: 'var(--theme-text)',
          lineHeight: 1.2,
          textAlign: 'center',
        }}
      >
        Ginger and Co
      </span>
      <span
        style={{
          fontSize: '0.875rem',
          fontWeight: 500,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--theme-elevation-500)',
        }}
      >
        CRM
      </span>
    </div>
  )
}
