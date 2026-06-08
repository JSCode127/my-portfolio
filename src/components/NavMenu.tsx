import styles from "../styles/Home.module.css";

type NavMenuProps = {
  text : string;
  onNavigate: (path: string) => void;
};

export default function NavMenu({ text, onNavigate }: NavMenuProps) {

  return (
    <div className={styles.container}>
        <div style={{ color: "white"}}>
            <h1 style={{ margin: "0"}} className={`${styles.item} ${styles.delay1}`}>{text}</h1>
        </div>
        <nav className={styles.nav}>
          <ul>
            <li><button className={`${styles.item} ${styles.delay2}`} onClick={() => onNavigate("/")}>Home</button></li>
            <li><button className={`${styles.item} ${styles.delay3}`} onClick={() => onNavigate("/about")}>About</button></li>
            <li><button className={`${styles.item} ${styles.delay4}`} onClick={() => onNavigate("/skills")}>Skills</button></li>
            <li><button className={`${styles.item} ${styles.delay5}`} onClick={() => onNavigate("/projects")}>Projects</button></li>
          </ul>
        </nav>
      </div>
  );
}