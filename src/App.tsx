// App.tsx
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Skills from "./pages/Skill";
import UniverseCanvas from "./components/UniverseCanvas";
import { useMemo, useState } from "react";
import NavMenu from "./components/NavMenu";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [transition, setTransition] = useState<
  "idle" | "collect" | "explode"
  >("idle");

  const navText = useMemo(() => { 
    switch (location.pathname) { 
      case "/about": return "About"; 
      case "/projects": return "Projects"; 
      case "/skills": return "Skills"; 
      default: return "JS Portfolio"; 
    } 
  }, [location.pathname]);
  
  const baseMode = useMemo(() => {
    return location.pathname === "/" ? "sphere" : "explode";
  }, [location.pathname]);
  const universeMode = transition !== "idle" ? transition : baseMode;
    const navigateWithUniverse = (path: string) => {
    setTransition("collect");

    setTimeout(() => {
      setTransition("explode");
    }, 500);

    setTimeout(() => {
      navigate(path);

      // 遷移完了後はidleに戻す
      setTimeout(() => {
        setTransition("idle");
      }, 50);
    }, 1000);
  };

  return (
    <div
    style={{
      position: "absolute",
      inset: 0,
      overflowX: "hidden",
    }}
  >
      <UniverseCanvas mode={universeMode} />

    <div className="ui-layer">
      <NavMenu
        text={navText}
        onNavigate={navigateWithUniverse}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </div>
    </div>
  );
}

export default App;