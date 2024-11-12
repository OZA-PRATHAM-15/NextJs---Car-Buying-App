import Navbar from '../components/Navbar';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <video autoPlay muted loop className={styles.backgroundVideo}>
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>

      <Navbar />


      <main className={styles.main}>

      </main>
    </div>
  );
}
