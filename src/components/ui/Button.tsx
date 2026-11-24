import type { ButtonHTMLAttributes } from "react";
import "./Button.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "quiet";
}

const Button = ({
  variant = "primary",
  type = "button",
  className = "",
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`.trim()}
      {...props}
    />
  );
};

export default Button;
