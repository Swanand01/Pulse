import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";
import SettingsSheet from "@/components/ui/settings-sheet";
import Home from "./components/routes/Home";
import Room from "./components/routes/Room";
import { Toaster } from "./components/ui/toaster";

function App() {
  const location = useLocation();
  const inRoom = location.pathname !== "/";

  return (
    <div className="bg-background flex h-full flex-col antialiased w-full">
      <Header right={inRoom ? <SettingsSheet /> : undefined} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:roomId" element={<Room />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
