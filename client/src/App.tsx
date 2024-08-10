import { Routes, Route } from "react-router-dom";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import Home from "./components/routes/Home";
import Room from "./components/routes/Room";
import Setup from "./components/routes/Setup";

function App() {
  return (
    <div className="bg-background flex h-full flex-col antialiased w-full">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/:roomId" element={<Room />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
