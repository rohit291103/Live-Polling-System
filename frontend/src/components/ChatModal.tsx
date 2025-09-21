import { useState } from 'react';
import styles from './ChatModal.module.css';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: string[];
  // We will add chat messages later
}

const ChatModal = ({ isOpen, onClose, participants }: ChatModalProps) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'participants'>('participants');

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className={styles.backdrop} onClick={onClose}></div>
      <div className={styles.modal}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'chat' ? styles.active : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            Chat
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'participants' ? styles.active : ''}`}
            onClick={() => setActiveTab('participants')}
          >
            Participants
          </button>
        </div>
        <div className={styles.content}>
          {activeTab === 'participants' && (
            <ul className={styles.participantList}>
              {participants.map((name, index) => (
                <li key={index} className={styles.participantItem}>
                  {name}
                </li>
              ))}
            </ul>
          )}
          {activeTab === 'chat' && (
            <div className={styles.chatComingSoon}>
              <p>Chat functionality coming soon!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatModal;