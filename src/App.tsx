// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import Skills from "./pages/Skill";
import UniverseCanvas from "./components/UniverseCanvas";
import { useState } from "react";

function App() {
  const [mode, setMode] = useState<"sphere" | "explode">("sphere");

  return (
    <BrowserRouter>
    <UniverseCanvas mode={mode} />
      <Routes>
        <Route path="/" element={<Home setMode={setMode} />} />
        <Route path="/profile" element={<Profile setMode={setMode} />} />
        <Route path="/projects" element={<Projects setMode={setMode} />} />
        <Route path="/skills" element={<Skills setMode={setMode} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;