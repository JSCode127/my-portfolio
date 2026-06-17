import styles from "../styles/AnimatedText.module.css";

type Props = {
  text: string;
};

export default function AnimatedText({
  text,
}: Props) {
  return (
    <>
      {text.split("").map((char, index) => (
        <span
          key={index}
          className={styles.char}
          style={{
            animationDelay: `${index * 0.08}s`,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </>
  );
}