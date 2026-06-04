import { useEffect, useState } from "react";
import NavMenu from "../components/NavMenu";
import styles from "../styles/Skills.module.css";

const skillGroups = [
  {
    title: "Frontend",
    skills: [
      { name: "HTML", level: 5 },
      { name: "CSS", level: 5 },
      { name: "JavaScript", level: 5 },
      { name: "TypeScript", level: 5 },
      { name: "React", level: 5 },
      { name: "Vue.js", level: 5 },
      { name: "Next.js", level: 4 },
      { name: "Tailwind CSS", level: 4 },
      { name: "Jest", level: 3 },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "PHP", level: 4 },
      { name: "WordPress", level: 4 },
      { name: "Python", level: 3 },
      { name: "C#", level: 3 },
      { name: "Kotlin", level: 3 },
    ],
  },
  {
    title: "Tools",
    skills: [
      { name: "Git / GitHub / GitLab", level: 5 },
      { name: "Figma", level: 5 },
      { name: "VS Code", level: 5 },
      { name: "Illustrator", level: 4 },
      { name: "Photoshop", level: 4 },
      { name: "XD", level: 4 },
    ],
  },
];

const Star = ({ level }: { level: number }) => {
  return (
    <span>
      {"★".repeat(level)}
      {"☆".repeat(5 - level)}
    </span>
  );
};

type Props = {
  setMode: (mode: "sphere" | "explode") => void;
};

function Skills({ setMode }: Props) {
  const [hoverPos, setHoverPos] = useState<{x: number, y: number | null}>({
  x: 0,
  y: null
});

  useEffect(() => {
      setMode("explode");
    }, []);

  return (
    <>
    <NavMenu text="Skills" onHoverChange={(x, y) => setHoverPos({ x, y })}  />    
    <div className={styles.container}>
      {skillGroups.map((group) => (
        <div key={group.title} className={styles.section}>
          <h2 className={styles.title}>{group.title}</h2>

          <div className={styles.grid}>
            {group.skills.map((skill) => (
              <div key={skill.name} className={styles.card}>
                <div>{skill.name}</div>
                <Star level={skill.level} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    </>
  );
}

export default Skills;