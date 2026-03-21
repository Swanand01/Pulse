import { Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useUsername } from "@/hooks/useUsername";

export default function SettingsSheet() {
  const { username, setUsername } = useUsername();
  const [open, setOpen] = useState(!username);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formElements = form.elements as typeof form.elements & {
      usernameInput: HTMLInputElement;
    };
    setUsername(formElements.usernameInput.value);
    setOpen(false);
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        if (!v && !username) return;
        setOpen(v);
      }}
    >
      <SheetTrigger asChild>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Settings className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent
        onInteractOutside={(e) => {
          if (!username) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (!username) e.preventDefault();
        }}
        className={!username ? "[&>button:last-child]:hidden" : ""}
      >
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <div className="mt-8 space-y-6 px-1">
          <div>
            <p className="text-sm font-medium text-foreground">Nickname</p>
            <p className="text-sm text-muted-foreground mt-1">
              How you appear to others in a room.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              id="usernameInput"
              placeholder="Cool nickname"
              maxLength={20}
              defaultValue={username}
              required
              className="bg-white/5 border-white/10"
            />
            <Button type="submit" className="w-full rounded-full font-medium">
              Save
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
