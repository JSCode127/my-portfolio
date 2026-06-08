import styles from "../styles/Skills.module.css";

const skillGroups = [
  {
    title: "Programming Languages",
    description:
      "基礎となる言語スキル。構文理解から実装、API連携まで対応可能。",
    skills: [
      { name: "JavaScript", level: 5 },
      { name: "TypeScript", level: 5 },
      { name: "Python", level: 3 },
      { name: "PHP", level: 4 },
      { name: "Java", level: 3 },
      { name: "C#", level: 3 },
      { name: "Kotlin", level: 3 },
    ],
  },
  {
    title: "Frontend Frameworks / Libraries",
    description:
      "SPA開発やUI構築。状態管理やコンポーネント設計を含めた実装が可能。",
    skills: [
      { name: "React", level: 5 },
      { name: "Next.js", level: 4 },
      { name: "Vue.js", level: 5 },
      { name: "Tailwind CSS", level: 4 },
      { name: "Jest", level: 3 },
    ],
  },
  {
    title: "Backend Frameworks",
    description:
      "API設計やサーバーサイド開発。認証・CRUD・簡易設計まで対応可能。",
    skills: [
      { name: "Django", level: 3 },
      { name: "WordPress", level: 4 },
    ],
  },
  {
    title: "Databases",
    description:
      "RDB設計、SQL操作、基本的なパフォーマンスを意識したクエリ設計が可能。",
    skills: [
      { name: "MySQL", level: 4 },
      { name: "PostgreSQL", level: 4 },
      { name: "SQLServer", level: 3 },
      { name: "Firebase", level: 3 },
    ],
  },
  {
    title: "Infrastructure / DevOps",
    description:
      "クラウド環境やバージョン管理。基本的なデプロイ・運用理解あり。",
    skills: [
      { name: "AWS", level: 4 },
      { name: "Git / GitHub / GitLab", level: 5 },
    ],
  },
  {
    title: "Design Tools",
    description:
      "UI/UXデザイン・バナー制作・プロトタイプ作成が可能。",
    skills: [
      { name: "Figma", level: 5 },
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

function Skills() {

  return (
    <>  
    <div className={styles.container}>
      {skillGroups.map((group) => (
        <div key={group.title} className={`${styles.section} ${styles.item} ${styles.delay2}`}>
          <h2 className={`${styles.title} ${styles.item} ${styles.delay3}`}>{group.title}</h2>
          <p className={`${styles.description} ${styles.item} ${styles.delay3}`}>{group.description}</p>

          <div className={styles.grid}>
            {group.skills.map((skill) => (
              <div key={skill.name} className={`${styles.card} ${styles.item} ${styles.delay4}`}>
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