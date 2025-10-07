// apps/web/src/components/ColorPaletteModal.tsx
import "../styles/ColorPalette.css";

interface ColorPaletteModalProps {
  onSelect: (color: string) => void;
  onClose: () => void;
}

const colors = [
  { hex: "#FFBFC5", name: "Light Pink" },
  { hex: "#A8D1E7", name: "Baby Blue" },
  { hex: "#f59ac1", name: "Pink" },
  { hex: "#D4A3C4", name: "Pink Purple" },
  { hex: "#bba3d4", name: "Lavender" },
];

export default function ColorPaletteModal({ onSelect, onClose }: ColorPaletteModalProps) {
  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50"
      onClick={onClose} // closes when clicking backdrop
    >
      <div
        className="container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="palette">
          {colors.map((color) => (
            <div
              key={color.hex}
              className="color"
              style={{ background: color.hex }}
              onClick={() => {
                onSelect(color.hex);
                onClose(); // 👈 also close after selecting color
              }}
            >
              <span>{color.name.toUpperCase()}</span>
            </div>
          ))}
        </div>

        <div id="stats">
          <span>Choose Color</span>
          <button
            onClick={onClose}
            aria-label="close"
            className="hover:scale-110 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
              <path d="M4 7.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5S5.5 9.83 5.5 9 4.83 7.5 4 7.5zm10 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-5 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5S9.83 7.5 9 7.5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
