import { CheckCircle, Globe, Lock } from "lucide-react";

const FEATURES = [
  {
    icon: <CheckCircle />,
    heading: "Easy to Use",
    text: "No login or sign-up needed. Open the web app and start sharing instantly!",
  },
  {
    icon: <Lock />,
    heading: "Secure",
    text: "Your files are transferred browser to browser, and never stored on the server.",
  },
  {
    icon: <Globe />,
    heading: "Anywhere",
    text: "Effortlessly share files across any device, no matter where you are in the world.",
  },
];

export default function Features() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 px-8 prose prose-invert">
      {FEATURES.map(({ icon, heading, text }) => (
        <div className="flex flex-col max-w-80 gap-4" key={heading}>
          <div className="flex gap-2 items-center">
            {icon}
            <h3 className="m-0">{heading}</h3>
          </div>
          <p className="my-0">{text}</p>
        </div>
      ))}
    </div>
  );
}
