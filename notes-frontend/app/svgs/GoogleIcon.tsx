interface GoogleIconProps {
  className?: string;
}

export function GoogleIcon({ className }: GoogleIconProps) {
  return (
    <svg viewBox="0 0 46 46" aria-hidden="true" className={className ?? "h-4 w-4"}>
      <path
        d="M23 9.5c3.9 0 6.7 1.7 8.2 3.2l6-6C33.8 3 28.8 1 23 1 13.5 1 5.5 6.9 2.6 15.4l7.1 5.5C11.4 16 16.7 9.5 23 9.5Z"
        fill="#4882df"
      />
      <path
        d="M44.5 23.3c0-1.5-.1-2.6-.4-3.8H23v7.2h11.9c-.5 2.6-2 4.6-4.1 6l6.4 5c3.8-3.5 6-8.5 6-14.4Z"
        fill="#34A853"
      />
      <path
        d="M10 27.1c-.5-1.5-.8-3.1-.8-4.7 0-1.7.3-3.2.8-4.7L2.6 12.2C.9 15.4 0 18.9 0 23c0 4.1.9 7.6 2.6 10.8l7.4-6.7Z"
        fill="#FBBC05"
      />
      <path
        d="M23 44.5c5.8 0 10.8-1.9 14.4-5.1l-6.6-5.1c-1.9 1.3-4.2 2.1-7.8 2.1-6.2 0-11.5-4.7-13.4-11.1L2.6 33.9C5.5 42 13.5 44.5 23 44.5Z"
        fill="#EA4335"
      />
    </svg>
  );
}
