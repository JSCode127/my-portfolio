import { useEffect, useState } from "react";
import NavMenu from "../components/NavMenu";

type Props = {
  setMode: (mode: "sphere" | "explode") => void;
};

function Profile({ setMode }: Props) {
  const [hoverPos, setHoverPos] = useState<{x: number, y: number | null}>({
  x: 0,
  y: null
});

  useEffect(() => {
    setMode("explode");
  }, []);

  return (
    <>
      <NavMenu 
        text="Profile"
         onHoverChange={(x, y) => setHoverPos({ x, y })}
         />
    </>
  );
}

export default Profile;