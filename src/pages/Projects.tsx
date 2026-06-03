import { useState } from "react";
import NavMenu from "../components/NavMenu";
import ParticleField from "../components/ParticleField";

function Projects() {
    const [hoverPos, setHoverPos] = useState<{x: number, y: number | null}>({
  x: 0,
  y: null
});
  return (
    <>
      <ParticleField hoverPos={hoverPos} />
      <NavMenu text="Projects" onHoverChange={(x, y) => setHoverPos({ x, y })} />
    </>
  );
}

export default Projects;