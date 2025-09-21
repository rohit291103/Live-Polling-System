import { useState } from 'react';
import styles from './Join.module.css';

// Define the component's props to communicate with the parent (App.tsx)
interface JoinProps {
  onJoin: (role: 'student' | 'teacher') => void;
}

const Join = ({ onJoin }: JoinProps) => {
  const [role, setRole] = useState<'student' | 'teacher' | null>(null);

  const handleContinue = () => {
    if (role) {
      onJoin(role);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>✨ Intervue Poll</div>
        <h1 className={styles.mainTitle}>Welcome to the Live Polling System</h1>
        <p className={styles.subtitle}>
          Please select the role that best describes you to begin using the live polling system
        </p>

        <div className={styles.roleSelector}>
          {/* Student Card */}
          <div
            className={`${styles.roleCard} ${role === 'student' ? styles.selected : ''}`}
            onClick={() => setRole('student')}
          >
            <h2 className={styles.cardTitle}>I'm a Student</h2>
            <p className={styles.cardDescription}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry
            </p>
          </div>

          {/* Teacher Card */}
          <div
            className={`${styles.roleCard} ${role === 'teacher' ? styles.selected : ''}`}
            onClick={() => setRole('teacher')}
          >
            <h2 className={styles.cardTitle}>I'm a Teacher</h2>
            <p className={styles.cardDescription}>
              Submit answers and view live poll results in real-time.
            </p>
          </div>
        </div>

        <button
          className={styles.continueButton}
          onClick={handleContinue}
          disabled={!role}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Join;