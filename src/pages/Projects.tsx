import styles from "../styles/Projects.module.css";

const projects = [
  {
    title: "地域住民向け情報サイト制作・運用",
    period: "2020.04 - 2022.07",
    role: "Web Designer / Frontend Engineer",
    description:
      "地域住民向け情報サイトの制作・運用を担当。デザイン制作からフロントエンド実装、CMS運用、データベース連携、SEO施策まで幅広く携わった。",
    tech: [
      "HTML",
      "CSS",
      "JavaScript",
      "WordPress",
      "PHP",
      "MySQL",
    ],
  },
  {
    title: "動画配信システム開発",
    period: "2022.08 - 2023.06",
    role: "Frontend Engineer",
    description:
      "ライブ配信機能を備えた動画配信サービスの新規開発案件。チャット機能の設計・実装を中心に、UI実装や不具合改修にも対応した。",
    tech: [
      "Next.js",
      "TypeScript",
      "HTML",
      "CSS",
    ],
  },
  {
    title: "ポイントサイト改修",
    period: "2023.07 - 2024.03",
    role: "Frontend Engineer",
    description:
      "大手通信会社向けポイントサイトの改修案件。フロントエンド開発およびデザイン実装を担当し、デザインチームと連携しながら機能改善を行った。",
    tech: [
      "Vue.js",
      "Node.js",
      "Tailwind CSS",
      "Jest",
      "AWS",
    ],
  },
  {
    title: "不動産会社向け営業支援システム改修",
    period: "2025.06 - 2025.12",
    role: "Full Stack Engineer",
    description:
      "営業支援システムの機能追加および保守開発を担当。C#を用いたバックエンド改修を中心に、API連携やUI改善にも携わった。",
    tech: [
      "Vue.js",
      "TypeScript",
      "C#",
      "MySQL",
      "AWS",
    ],
  },
  {
    title: "教育関連企業向けシステム開発",
    period: "2026.01 - 2026.03",
    role: "Frontend Engineer",
    description:
      "大規模業務システムの改修案件。Excelデータの登録・保存処理を行う画面の機能改修を中心に担当した。",
    tech: [
      "React",
      "TypeScript",
      "Node.js",
    ],
  },
];

export default function Projects() {
  return (
    <div className={`${styles.container} ${styles.item} ${styles.delay2}`}>
      <p className={`${styles.lead} ${styles.item} ${styles.delay3}`}>
        主要な経歴
      </p>

      <div className={`${styles.list} ${styles.item} ${styles.delay4}`}>
        {projects.map((project) => (
          <div key={project.title} className={styles.card}>
            <div className={styles.header}>
              <h2>{project.title}</h2>
              <span>{project.period}</span>
            </div>
            <div className={styles.box}>
              <p className={styles.role}>{project.role}</p>
              <p className={styles.description}>{project.description}</p>

              <div className={styles.tech}>
                {project.tech.map((t) => (
                  <span key={t} className={styles.tag}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}