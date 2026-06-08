import styles from "../styles/Home.module.css";

type NavMenuProps = {
  text : string;
  onNavigate: (path: string) => void;
};

export default function NavMenu({ text, onNavigate }: NavMenuProps) {

  return (
    <div className={styles.container}>
        <div style={{ color: "white"}}>
            <h1 style={{ margin: "0"}}>{text}</h1>
        </div>
        <nav className={styles.nav}>
          <ul>
            <li><button onClick={() => onNavigate("/")}>Home</button></li>
            <li><button onClick={() => onNavigate("/profile")}>Profile</button></li>
            <li><button onClick={() => onNavigate("/skills")}>Skills</button></li>
            <li><button onClick={() => onNavigate("/projects")}>Projects</button></li>
          </ul>
        </nav>
      </div>
  );
}