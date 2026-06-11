import { useEffect, useState } from "react";
import styles from "../styles/ScrollTop.module.css";

export default function ScrollTop() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const el = document.querySelector(".app-scroll-container");

    if (!el) return;

    const onScroll = () => {
      setShowTop(el.scrollTop > 30);
    };

    el.addEventListener("scroll", onScroll);
    onScroll();

    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    const el = document.querySelector(".app-scroll-container");

    if (!el) return;

    el.scrollTo({
        top: 0,
        behavior: "smooth",
    });
    };

  return (
    <button className={`${styles.hint} ${
        showTop ? styles.visible : ""
    }`} onClick={scrollToTop}>
        <div className={styles.ring}></div>

        <div className={styles.mouse}>
            <div className={styles.dot}></div>
        </div>

        <p>Scroll Top</p>
    </button>
  );
}