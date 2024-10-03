import styles from "./page.module.css";
import FlappyPepe from "./components/Game";



export default function Home() {
  return (
      <main className={styles.main}>
    <FlappyPepe />
      </main>
     
  );
}
