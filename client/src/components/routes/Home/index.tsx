import Features from "./Features";
import Hero from "./Hero";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col justify-center sm:gap-28">
      <Hero />
      <Features />
    </div>
  );
}
