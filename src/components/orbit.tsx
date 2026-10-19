export function Orbit() {
  return (
    <div className="orbit-art" aria-hidden="true">
      <svg viewBox="0 0 400 290" fill="none">
        <defs>
          <linearGradient id="orbit-grad" x1="40" y1="30" x2="320" y2="270">
            <stop stopColor="#b1ceaa" />
            <stop offset="1" stopColor="#456d5d" />
          </linearGradient>
        </defs>
        <ellipse
          cx="200"
          cy="145"
          rx="149"
          ry="66"
          transform="rotate(-30 200 145)"
          stroke="#719682"
          strokeWidth="1"
        />
        <ellipse
          cx="200"
          cy="145"
          rx="118"
          ry="104"
          transform="rotate(30 200 145)"
          stroke="#567a66"
          strokeDasharray="3 6"
        />
        <circle
          cx="200"
          cy="145"
          r="73"
          fill="url(#orbit-grad)"
          fillOpacity="0.15"
          stroke="#7ea18b"
        />
        <path
          d="M127 145h146M200 72v146"
          stroke="#7ea18b"
          strokeOpacity="0.5"
        />
        <ellipse cx="200" cy="145" rx="35" ry="73" stroke="#7ea18b" />
        <ellipse cx="200" cy="145" rx="73" ry="28" stroke="#7ea18b" />
        <circle cx="322" cy="74" r="7" fill="#ddad70" />
        <circle cx="96" cy="223" r="5" fill="#c4d9b9" />
        <circle cx="201" cy="145" r="6" fill="#d9e5cc" />
        <path d="M297 211l9 9m-9 0l9-9M85 67h10m-5-5v10" stroke="#d9e5cc" />
        <text
          x="248"
          y="33"
          fill="#c6d8c9"
          fontFamily="Georgia"
          fontStyle="italic"
          fontSize="17"
        >
          curiosity → clarity
        </text>
        <text x="40" y="150" fill="#c6d8c9" fontFamily="Georgia" fontSize="20">
          x
        </text>
      </svg>
      <span className="orbit-tag tag-one">A familiar world</span>
      <span className="orbit-tag tag-two">A deeper understanding</span>
    </div>
  );
}
