import { Routes, Route } from "react-router-dom";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import Home from "./components/routes/Home";
import Room from "./components/routes/Room";

function App() {
  return (
    <div className="bg-background flex min-h-screen flex-col antialiased w-full">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:roomId" element={<Room />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
