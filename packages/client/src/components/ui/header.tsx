import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
  right?: React.ReactNode;
}

export default function Header({ className, right }: HeaderProps) {
  return (
    <nav
      className={cn(
        "flex justify-between border-b items-center px-8 py-2 snap-start sticky top-0 z-50 backdrop-blur-md bg-background/75 border-white/10",
        className,
      )}
    >
      <Link
        to="/"
        className="text-2xl font-bold tracking-tight text-foreground"
      >
        Pulse<span className="text-primary">.</span>
      </Link>
      {right}
    </nav>
  );
}
