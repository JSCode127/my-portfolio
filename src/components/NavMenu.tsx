import styles from "../styles/Home.module.css";

type NavMenuProps = {
  text : string;
  onHoverChange: (x: number, y: number | null) => void;
};

export default function NavMenu({ text, onHoverChange }: NavMenuProps) {

    const handleEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    onHoverChange(x, y);
  };

  const handleLeave = () => {
    onHoverChange(0, null); // ← hover解除
  };

  return (
    <div className={styles.container}>
        <div style={{ color: "white"}}>
            <h1>{text}</h1>
        </div>
        <nav className={styles.nav}>
          <ul>
            <li><a href="/" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>Home</a></li>
            <li><a href="/profile" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>Profile</a></li>
            <li><a href="/skills" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>Skills</a></li>
            <li><a href="/projects" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>Projects</a></li>
          </ul>
        </nav>
      </div>
  );
}