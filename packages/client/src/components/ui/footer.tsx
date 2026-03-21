import { Star } from "lucide-react";

export default function Footer() {
  return (
    <div className="px-8 py-3 border-t border-white/10 backdrop-blur-md bg-background/75 flex items-center justify-between snap-start">
      <a
        href="https://github.com/Swanand01"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        Made by Swanand
      </a>
      <a
        href="https://github.com/Swanand01/Pulse"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <Star className="h-3 w-3" />
        Star on GitHub
      </a>
    </div>
  );
}
