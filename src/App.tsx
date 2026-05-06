import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SchedulePage from "./pages/SchedulePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/quan-ly-san" element={<SchedulePage />} />
      </Routes>
    </BrowserRouter>
  );
}
