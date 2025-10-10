export default function StickyNoteIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      className="text-yellow-400 dark:text-yellow-600"
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeWidth="2"
      stroke="#dbd9d9"
      fill="none"
      viewBox="0 0 24 24"
      height={size}
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z" />
      <path d="M15 3v6h6" />
    </svg>
  );
}
