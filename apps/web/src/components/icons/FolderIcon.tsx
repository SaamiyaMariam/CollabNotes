export default function FolderIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      fill="none"
      height={size}
      width={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        clipRule="evenodd"
        fillRule="evenodd"
        stroke="#dbd9d9"
        strokeLinecap="round"
        strokeWidth="2"
      >
        <path d="M3 7h17c.5523 0 1 .44772 1 1v11c0 .5523-.4477 1-1 1H4c-.5523 0-1-.4477-1-1V7Z" />
        <path d="M3 4.5c0-.27614.22386-.5.5-.5h6.29289c.13261 0 .25981.05268.35351.14645L13 7.00003H3Z" />
      </g>
    </svg>
  );
}
