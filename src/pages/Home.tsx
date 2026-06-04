import { useEffect, useState } from "react";
import NavMenu from "../components/NavMenu";

type Props = {
  setMode: (mode: "sphere" | "explode") => void;
};

function Home({ setMode }: Props) {
  const [hoverPos, setHoverPos] = useState<{x: number, y: number | null}>({
  x: 0,
  y: null
});

  useEffect(() => {
    setMode("sphere");
  }, []);

  return (
    <>
      <NavMenu 
        text="JS Portfolio"
         onHoverChange={(x, y) => setHoverPos({ x, y })} 
         />

      <div style={{color: "white", paddingLeft: "40px"}}>
        <h3 style={{ margin: "0"}}>FrontEnd Developer</h3>
      </div>
    </>
  );
}
export default Home;