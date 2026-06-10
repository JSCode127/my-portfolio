import styles from "../styles/ClickHint.module.css";

export default function ClickHint() {
  return (
    <div className={styles.hint}>
      <div className={styles.ring}></div>

      <div className={styles.mouse}>
        <div className={styles.dot}></div>
      </div>

      <p>Click to Evolve</p>
    </div>
  );
}