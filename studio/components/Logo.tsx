/* The wordmark, so the Studio opens looking like Efamy rather than Sanity. */
export function Logo() {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: 6,
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: 20,
        letterSpacing: '0.01em',
        color: '#8b2d2d',
      }}
    >
      efamy
      <span style={{fontSize: 11, letterSpacing: '0.14em', color: '#cb9954'}}>SHOP</span>
    </span>
  )
}
