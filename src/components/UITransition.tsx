import styles from "../styles/UITransition.module.css";

type Props = {
  state: "idle" | "collect" | "explode" | "enterUI";
  children: React.ReactNode;
};

export default function UITransition({ state, children }: Props) {
  const visible = state === "enterUI" || state === "idle";

  return (
    <div className={`${styles.uiWrapper} ${visible ? styles.show : ""}`}>
      {children}
    </div>
  );
}