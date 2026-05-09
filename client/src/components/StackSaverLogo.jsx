export default function StackSaverLogo({ size = 'md', showText = true, className = '' }) {
  const sizes = {
    sm: { mark: 'w-7 h-7', icon: 'w-4 h-4', text: 'text-sm' },
    md: { mark: 'w-9 h-9', icon: 'w-5 h-5', text: 'text-lg' },
    lg: { mark: 'w-16 h-16', icon: 'w-10 h-10', text: 'text-3xl' },
    xl: { mark: 'w-20 h-20 sm:w-24 sm:h-24', icon: 'w-12 h-12 sm:w-16 sm:h-16', text: 'text-4xl sm:text-5xl md:text-6xl' },
  };
  const current = sizes[size] || sizes.md;

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className={`${current.mark} stack-logo-mark`}>
        <svg
          className={current.icon}
          viewBox="0 0 48 48"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M14 15.5C14 10.8 18 7 24 7c4.9 0 8.6 2.6 9.8 6.5"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M34 32.5C34 37.2 30 41 24 41c-4.9 0-8.6-2.6-9.8-6.5"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M16 25h16"
            stroke="#a7f3d0"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M24 13v22"
            stroke="#a7f3d0"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {showText && (
        <span className={`font-bold tracking-tight text-white ${current.text}`}>
          Stack Saver
        </span>
      )}
    </div>
  );
}
