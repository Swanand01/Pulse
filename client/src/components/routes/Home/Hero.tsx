import { Link } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import { Button } from "@/components/ui/button";
import useLocalStorage from "@/hooks/useLocalStorage";

export default function Hero() {
  const [username] = useLocalStorage("username", null);
  const roomId = uuidV4();

  let btnLink = `/${roomId}`;
  if (!username) {
    btnLink = `/settings?roomId=${roomId}`;
  }

  return (
    <div className="px-8 prose prose-invert flex flex-col justify-center gap-y-4 h-[95svh] sm:h-fit snap-start">
      <h2 className="mb-0">Pulse: Next-Gen File Sharing, Fast and Free.</h2>
      <p className="mb-0">
        Instantly share files with anyone, anywhere, directly through your
        browser.
      </p>
      <Link to={btnLink} className="w-fit">
        <Button>Start Sharing</Button>
      </Link>
    </div>
  );
}
