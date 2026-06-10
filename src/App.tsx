// App.tsx
import { Routes, Route, useNavigate } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Skills from "./pages/Skill";
import UniverseCanvas from "./components/UniverseCanvas";
import { useState } from "react";
import NavMenu from "./components/NavMenu";

type TextState =
  | "JS Portfolio"
  | "About"
  | "Skills"
  | "Projects";

function App() {
  //背景モーション管理
  const [universeMode, setUniverseMode] = useState<"sphere" |"collect" | "explode">("sphere");
  //ナビゲーションメニュー状態管理
  const [navText, setNavText] = useState<TextState>("JS Portfolio");

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

      if (path === "/about") {
        setNavText("About");
      } else if (path === "/projects") {
        setNavText("Projects");
      } else if (path === "/skills") {
        setNavText("Skills")
      } else {
        setNavText("JS Portfolio")
      }
    }, 1000);
  };

  return (
    <>
    <UniverseCanvas mode={universeMode}  />
    <div
      style={{
        position: "relative",
        zIndex: 1000,
      }}
    >
      <NavMenu 
          text={navText}
          onNavigate={navigateWithUniverse}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/skills" element={<Skills />} />
        </Routes>
      </div>
    </>
  );
}

export default App;