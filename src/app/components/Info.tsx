import React, { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa'; // Import the info icon from React Icons
import styles from '../style/animation.module.css'; // Import the CSS module
import Image from 'next/image';


const InfoPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle the overlay
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Info Icon to trigger the popup */}
      <div className={styles.iconContainer}>
        <FaInfoCircle
          className={styles.infoIcon}
          onClick={togglePopup} // Toggle the popup on click
          size={30} // Adjust the icon size as needed
          color="#fff" // Adjust the color of the icon
        />
      </div>

      {/* Popup Overlay */}
      {isOpen && (
        <div className={styles.overlay}>
        <div className={styles.popupContent} style={{ padding: '20px', textAlign: 'center', borderRadius: '10px', backgroundColor: '#fff', maxWidth: '400px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '10px', fontSize: '24px', color: '#333' }}>Flappy Baby Pepe v0.2</h2>
          <h3 style={{ marginBottom: '20px', fontSize: '20px', color: '#555' }}>flap. flap. flap.</h3>

          <Image 
            src="/output.gif" 
            width="100" 
            height="100" 
            alt="Example Image" 
            style={{ display: 'block', margin: '0 auto 20px auto', borderRadius: '10px' }} 
          />
          
          <p style={{ fontSize: '16px', color: '#333', marginBottom: '10px' }}>
            Made with love by code. @__c0d3
          </p>
          <h4>Future Updates: </h4>
          <p style={{ fontSize: '14px', color: '#777', marginBottom: '20px' }}>
            Global leaderboard, connect with wallet, enemies, new levels, more powerups.... </p>
          <p style={{ fontSize: '14px', color: '#777', marginBottom: '20px' }}>
            If you would like to support me and want to see continued development, drop a tip below.
          </p>
          
          <p style={{ fontSize: '12px', color: '#000', fontWeight: 'bold', marginBottom: '20px', wordBreak: 'break-word' }}>
            0x1fae75bbFfb8E8da6F3774D97A7A111287414238
          </p>
      
          <button 
            className={styles.closeButton} 
            onClick={togglePopup}
            style={{
              padding: '15px 70px',
              backgroundColor: '#ff3333',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Close
          </button>
        </div>
      </div>
      
      )}
    </>
  );
};

export default InfoPopup;
