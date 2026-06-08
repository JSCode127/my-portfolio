// App.tsx
import { Routes, Route, useNavigate } from "react-router-dom";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import Skills from "./pages/Skill";
import UniverseCanvas from "./components/UniverseCanvas";
import { useState } from "react";
import NavMenu from "./components/NavMenu";

function App() {
  const [universeMode, setUniverseMode] = useState<"sphere" |"collect" | "explode">("sphere");

  const navigate = useNavigate();
  const navigateWithUniverse = (
    path: string
  ) => {

    setUniverseMode("collect");

    setTimeout(() => {

      setUniverseMode("explode");

    }, 500);

    setTimeout(() => {

      navigate(path);

    }, 1000);

    setTimeout(() => {

      setUniverseMode("sphere");

    }, 1500);
  };

  return (
    <>
    <UniverseCanvas mode={universeMode}  />
    <NavMenu 
        text="JS Portfolio"
        onNavigate={navigateWithUniverse}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/skills" element={<Skills />} />
      </Routes>
    </>
  );
}

export default App;