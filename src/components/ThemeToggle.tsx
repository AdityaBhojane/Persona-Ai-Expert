import { ThemeToggleAnimated } from "./ui/theme-toggle-animated";

export function ThemeToggle() {
  return (
    <ThemeToggleAnimated 
      variant="circle-blur"
      start="top-right"
      className="hover:shadow-lg transition-shadow"
    />
  );
}