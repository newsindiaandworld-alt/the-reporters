export default function Logo({ className = "h-9 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 84"
      role="img"
      aria-label="The Reporter's — Investigative, Reliable, Now"
      className={className}
    >
      <text
        x="0"
        y="40"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="34"
        fontWeight="600"
        letterSpacing="0.5"
        fill="currentColor"
        className="text-slate-900 dark:text-white"
      >
        The Reporter’s
      </text>
      <line x1="1" y1="52" x2="358" y2="52" stroke="#B8934B" strokeWidth="1" />
      <text
        x="0"
        y="70"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="10"
        fontWeight="600"
        letterSpacing="3"
      >
        <tspan fill="currentColor" className="text-slate-500 dark:text-navy-300">
          INVESTIGATIVE
        </tspan>
        <tspan fill="#B8934B">{"  ·  "}</tspan>
        <tspan fill="currentColor" className="text-slate-500 dark:text-navy-300">
          RELIABLE
        </tspan>
        <tspan fill="#B8934B">{"  ·  "}</tspan>
        <tspan fill="currentColor" className="text-slate-500 dark:text-navy-300">
          NOW
        </tspan>
      </text>
    </svg>
  );
}
