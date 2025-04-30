// src/components/common/SuccessConfetti.js
import React, { useState, useEffect } from 'react';

// This is a simple confetti animation using emojis
// For a proper implementation, you would use a library like react-confetti
const SuccessConfetti = ({ duration = 3000 }) => {
  const [pieces, setPieces] = useState([]);
  const [show, setShow] = useState(true);
  
  useEffect(() => {
    // Create random confetti pieces
    const newPieces = [];
    const emojis = ['🎉', '🎊', '✨', '⭐', '🌟'];
    
    for (let i = 0; i < 50; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.5,
        animationDuration: (Math.random() * 3 + 2) + 's'
      });
    }
    
    setPieces(newPieces);
    
    // Hide after duration
    const timer = setTimeout(() => {
      setShow(false);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration]);
  
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map(piece => (
        <div
          key={piece.id}
          className="absolute animate-fall"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            fontSize: `${piece.size}rem`,
            opacity: piece.opacity,
            animationDuration: piece.animationDuration,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        >
          {piece.emoji}
        </div>
      ))}
    </div>
  );
};

export default SuccessConfetti;