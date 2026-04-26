export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="rounded-xl shrink-0"
    >
      <defs>
        <linearGradient id="dgGradient" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#29AAE1" />
          <stop offset="100%" stopColor="#0E1C42" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#dgGradient)" />
      <path
        d="M16 24l6 6 12-12"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
