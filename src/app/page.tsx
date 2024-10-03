import Image from "next/image";
import styles from "./page.module.css";
import FlappyBird from "./components/Game";



export default function Home() {
  return (
      <main className={styles.main}>
       
    <FlappyBird />
       
      </main>
     
  );
}
