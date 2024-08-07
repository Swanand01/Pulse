import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useRef } from "react";

interface SendFileButtonProps {
  sendFile: (file: File) => void;
  disabled: boolean;
  className?: string;
}

export default function SendFileButton({
  sendFile,
  disabled,
  className,
}: SendFileButtonProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      sendFile(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        onClick={handleButtonClick}
        disabled={disabled}
        className={cn(
          `prose flex gap-3 items-center p-6 transition-transform duration-500 ${
            disabled
              ? "opacity-50 scale-95"
              : "opacity-100 scale-105 hover:scale-110"
          }`,
          className,
        )}
      >
        <Plus />
        <h3 className="mt-0 hidden sm:block">Send File</h3>
      </Button>
    </>
  );
}
