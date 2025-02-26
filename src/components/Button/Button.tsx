import clsx from "clsx";
import s from "./Button.module.css";

import { ReactNode } from "react";

type ButtonProps = {
  size?: "sm" | "md" | "lg"|  "icon";
  variant?: "primary" | "secondary" | "outline" ;
  children: ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function Button({
  size = "md",
  variant = "primary",
  children,
  ...delegated
}: ButtonProps) {
  const classNames = clsx(s.button, s[variant], s[size]);

  return (
    <button className={classNames} {...delegated}>
      {children}
    </button>
  );
}

export default Button;
