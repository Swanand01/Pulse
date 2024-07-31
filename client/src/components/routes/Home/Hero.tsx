import { Link } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="px-8 prose prose-invert flex flex-col gap-y-4">
      <h2 className="mb-0">Pulse: Next-Gen File Sharing, Fast and Free.</h2>
      <p className="mb-0">
        Instantly share files with anyone, anywhere, directly through your
        browser.
      </p>
      <Link to={`/${uuidV4()}`} className="w-fit">
        <Button>Start Sharing</Button>
      </Link>
    </div>
  );
}
