import { useState } from "react";
import styles from "../styles/Home.module.css";

type NavMenuProps = {
  text: string;
  onNavigate: (path: string) => void;
};

export default function NavMenu({
  text,
  onNavigate,
}: NavMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const movePage = (path: string) => {
    setIsOpen(false);
    onNavigate(path);
  };

  return (
    <div className={styles.container}>
      <div style={{ color: "white" }}>
        <h1
          style={{ margin: "0" }}
          className={`${styles.item} ${styles.delay1}`}
        >
          {text}
        </h1>
      </div>

      {/* ハンバーガー */}
      <button
        className={`${styles.item} ${styles.delay2} ${styles.hamburger} ${
          isOpen ? styles.active : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav
        className={`${styles.nav} ${
          isOpen ? styles.open : ""
        }`}
      >
        <ul>
          <li>
            <button
              className={`${styles.item} ${styles.delay2}`}
              onClick={() => movePage("/")}
            >
              Home
            </button>
          </li>

          <li>
            <button
              className={`${styles.item} ${styles.delay3}`}
              onClick={() => movePage("/about")}
            >
              About
            </button>
          </li>

          <li>
            <button
              className={`${styles.item} ${styles.delay4}`}
              onClick={() => movePage("/skills")}
            >
              Skills
            </button>
          </li>

          <li>
            <button
              className={`${styles.item} ${styles.delay5}`}
              onClick={() => movePage("/projects")}
            >
              Projects
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}