import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
  label: React.ReactNode;
  options: { label: string; onClick: () => void }[];
}

export default function Dropdown({ label, options }: DropdownProps) {
    const [open, setOpen] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setOpen(true);
    };

    const handleMouseLeave = () => {
        // small delay before closing
        timeoutRef.current = setTimeout(() => {
        setOpen(false);
        }, 200);
    };


  return (
    <div
      className="relative inline-block text-left"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger */}
      <div
        className="flex items-center gap-2 cursor-pointer select-none"
        onClick={() => setOpen((prev) => !prev)}
      >
        {label}
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 text-white ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Menu */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-40 rounded-xl shadow-lg z-50 overflow-hidden
                     bg-gradient-to-br from-[#f4c3c8] to-[#eb8db5] text-white"
        >
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => {
                opt.onClick();
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-white/20 transition"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
