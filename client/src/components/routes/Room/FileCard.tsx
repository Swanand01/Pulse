import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FileCardProps {
  sendFile: (file: File) => void;
}

export default function FileCard({ sendFile }: FileCardProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSendFile = () => {
    if (selectedFile) {
      sendFile(selectedFile);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="prose dark:prose-invert p-4">
        <CardTitle>Send a File</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-2 p-4 pt-0">
        <Input type="file" name="file" onChange={handleFileChange} />
        <Button
          variant="default"
          onClick={handleSendFile}
          disabled={!selectedFile}
        >
          Send
        </Button>
      </CardContent>
    </Card>
  );
}
