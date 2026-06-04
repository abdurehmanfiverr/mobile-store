// The store's brand logo: a white rounded badge with a blue phone mark, next
// to a two-tone wordmark. The text colour is inherited from the parent, so it
// looks right on the blue header and the dark footer alike.
export default function Logo() {
  return (
    <span className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2563eb"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="14" height="20" x="5" y="2" rx="2.5" ry="2.5" />
          <path d="M10 5.5h4" />
          <path d="M12 18h.01" />
        </svg>
      </span>
      <span className="whitespace-nowrap text-lg font-bold tracking-tight sm:text-xl">
        Mobile <span className="font-normal opacity-90">&amp; Accessories</span>
      </span>
    </span>
  );
}
