import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function Settings() {
  const [username, setUsername] = useLocalStorage("username", "");
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId");
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formElements = form.elements as typeof form.elements & {
      usernameInput: HTMLInputElement;
    };
    const usernameInputValue = formElements.usernameInput.value;

    setUsername(usernameInputValue);

    if (roomId) {
      navigate(`/${roomId}`, { replace: true });
    } else {
      toast({ title: "Settings saved." });
    }
  }

  return (
    <div className="w-full px-8 sm:w-96 sm:px-0 m-auto space-y-8">
      <Card className="w-fit">
        <CardHeader className="prose prose-invert">
          <CardTitle>Choose a Nickname</CardTitle>
          <CardDescription>
            Nicknames are used to identify devices in a room.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <Input
              id="usernameInput"
              placeholder="Cool nickname"
              maxLength={20}
              defaultValue={username}
              required
            />
            <Button className="w-fit self-end" type="submit">
              Save
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
