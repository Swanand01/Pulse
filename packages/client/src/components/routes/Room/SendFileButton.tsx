import { Plus } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
      event.target.value = "";
    }
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
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
        className={cn("rounded-full px-6 gap-2 font-medium", className)}
      >
        <Plus className="h-4 w-4" />
        Send File
      </Button>
    </>
  );
}
