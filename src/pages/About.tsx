import ScrollTop from "../components/ScrollTop";
import styles from "../styles/About.module.css";

export default function About() {
  return (
    <div className={`${styles.container}`}>
      <div className={`${styles.item} ${styles.delay2}`}>
        <h2 className={styles.subTitle}>略歴</h2>
        <p className={styles.line}>現在、一児の母。</p>

        <p className={styles.line}>
          小規模IT会社にて約2年間、
          Webデザイン制作・サイト運用・アプリ開発に従事。
        </p>

        <p className={styles.line}>
          その後、現会社に入社。
        </p>

        <p className={styles.line}>
          現在に至るまで複数のプロジェクトに参画し、
          フロントエンド開発を中心にUI実装・機能開発を担当。
        </p>

        <p className={styles.line}>
          また、基本設計・詳細設計・コードレビューなどにも携わり、
          プロジェクト全体の品質向上に貢献している。
        </p>
      </div>

      <div className={`${styles.hobbySection} ${styles.item} ${styles.delay3}`}>
        <div className={`${styles.hobbyGrid} ${styles.item} ${styles.delay4}`}>
          <div className={styles.hobbyRow}>
            <span className={styles.label}>所在地</span>
            <span className={styles.value}>神奈川県</span>
          </div>

          <div className={styles.hobbyRow}>
            <span className={styles.label}>得意分野</span>
            <span className={styles.value}>フロントエンド開発</span>
          </div>

          <div className={styles.hobbyRow}>
            <span className={styles.label}>趣味</span>
            <span className={styles.value}>ゲーム・音楽鑑賞・猫吸い</span>
          </div>
        </div>
      </div>
      <ScrollTop />
    </div>
  );
}