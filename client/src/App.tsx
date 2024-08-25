import { Routes, Route } from "react-router-dom";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import Home from "./components/routes/Home";
import Room from "./components/routes/Room";
import Settings from "./components/routes/Settings";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="bg-background flex h-full flex-col antialiased w-full">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/:roomId" element={<Room />} />
      </Routes>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
