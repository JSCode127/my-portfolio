import ClickHint from "../components/ClickHint";
import styles from "../styles/Home.module.css";
function Home() {

  return (
    <>
      <ClickHint />
      <div style={{color: "white", paddingLeft: "40px"}}>
        <h3 className={`${styles.item} ${styles.delay1}`} style={{margin: "0"}}>FrontEnd Web Developer</h3>
      </div>
    </>
  );
}
export default Home;