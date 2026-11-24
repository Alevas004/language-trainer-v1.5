interface LockIconProps {
  size?: number;
}

// Candado en un solo color (hereda el color del texto), sin emojis
const LockIcon = ({ size = 22 }: LockIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <rect x="5" y="11" width="14" height="9" rx="2" fill="currentColor" />
    <path
      d="M8 11V8a4 4 0 0 1 8 0v3"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

export default LockIcon;
