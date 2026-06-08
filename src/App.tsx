// App.tsx
import { Routes, Route, useNavigate } from "react-router-dom";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import Skills from "./pages/Skill";
import UniverseCanvas from "./components/UniverseCanvas";
import { useState } from "react";
import NavMenu from "./components/NavMenu";
import UITransition from "./components/UITransition";

type TransitionState =
  | "idle"
  | "collect"
  | "explode"
  | "enterUI";

function App() {
  //背景モーション管理
  const [universeMode, setUniverseMode] = useState<"sphere" |"collect" | "explode">("sphere");
  //UI遷移管理
  const [transition, setTransition] = useState<TransitionState>("idle");

  const navigate = useNavigate();
  const navigateWithUniverse = (path: string) => {

    setUniverseMode("collect");

    setTimeout(() => {
      setUniverseMode("explode");
    }, 500);

    setTimeout(() => {

      navigate(path);

      if (path === "/") {
        setUniverseMode("sphere");
      } else {
        setUniverseMode("explode");
      }

      setTransition("enterUI");
    }, 1000);

    setTimeout(() => {
      setTransition("idle");
    }, 1800);
  };

  return (
    <>
    <UniverseCanvas mode={universeMode}  />
    <UITransition state={transition}>
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
      </UITransition>
    </>
  );
}

export default App;