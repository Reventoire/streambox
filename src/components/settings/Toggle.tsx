import "./Toggle.css";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export default function Toggle({ checked, onChange, disabled = false }: ToggleProps) {
  return (
    <button 
      className={`toggle-btn ${checked ? "toggle-checked" : ""} ${disabled ? "toggle-disabled" : ""}`}
      onClick={() => !disabled && onChange(!checked)}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
    >
      <span className="toggle-thumb" />
    </button>
  );
}
