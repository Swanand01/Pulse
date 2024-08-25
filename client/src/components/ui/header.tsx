import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  return (
    <nav
      className={cn(
        "flex justify-between border-b items-center px-8 py-2 snap-start",
        className,
      )}
    >
      <Link to="/" className="prose prose-invert flex gap-x-4">
        <h2 className="mt-0">Pulse.</h2>
      </Link>
      <Link to="/settings" className="prose prose-invert flex gap-x-4">
        <Settings className="h-6 w-6" />
      </Link>
    </nav>
  );
}
