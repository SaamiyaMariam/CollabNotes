import "../styles/Checkbox.css";

interface CheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Checkbox({ checked, onChange }: CheckboxProps) {
  return (
    <label
        className="pretty-checkbox-container absolute top-2 right-2 z-20 cursor-pointer"
        onClick={(e) => e.stopPropagation()}
        >
      <input type="checkbox" checked={checked} onChange={onChange} />
      <div className="checkmark"></div>
    </label>
  );
}
