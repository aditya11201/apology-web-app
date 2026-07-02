// Heart glyph used by floating hearts, confetti, and the balloon-pop burst.
// Path lifted from index.html heartSVG() (l. 727–729).
export function Heart({ color = '#FF5C8A', className = '', style }) {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" className={className} style={style}>
      <path
        fill={color}
        d="M12 21s-7.5-4.9-10-9.3C.4 8.4 2 5 5.2 5c2 0 3.3 1.1 4 2.2.7-1.1 2-2.2 4-2.2 3.2 0 4.8 3.4 3.2 6.7C19 16.1 12 21 12 21z"
      />
    </svg>
  )
}
