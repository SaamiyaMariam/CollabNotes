import React, { useState } from "react";
import "../styles/CardForm.css";

interface CardFormProps {
  heading: string;
  placeholder: string;
  buttonText?: string;
  onSubmit: (value: string) => void;
  onClose: () => void;
}

const CardForm: React.FC<CardFormProps> = ({
  heading,
  placeholder,
  buttonText = "Create",
  onSubmit,
  onClose,
}) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value);
    setValue("");
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="form-container relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <p className="title">{heading}</p>
        <form className="form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder={placeholder}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <button type="submit" className="submit-btn">
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CardForm;
