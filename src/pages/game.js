import { useEffect, useState } from 'react';
import styles from '../../styles/game.module.css';

const DUNGEON_SIZE = 20;

const generateRandomDungeon = () => {
  const dungeon = [];
  for (let i = 0; i < DUNGEON_SIZE; i++) {
    const row = [];
    for (let j = 0; j < DUNGEON_SIZE; j++) {
      // Usar '#' para paredes e '.' para pisos.
      row.push(Math.random() < 0.3 ? '#' : '.');
    }
    dungeon.push(row);
  }
  return dungeon;
};

export default function Game() {
    const [dungeon, setDungeon] = useState([]);
    const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setDungeon(generateRandomDungeon());
  }, []);

  const handleKeyPress = (event) => {
    const { key } = event;
    let newPosition = { ...playerPosition };
  
    if (key === 'ArrowUp') {
      newPosition.y = Math.max(newPosition.y - 1, 0);
    } else if (key === 'ArrowDown') {
      newPosition.y = Math.min(newPosition.y + 1, DUNGEON_SIZE - 1);
    } else if (key === 'ArrowLeft') {
      newPosition.x = Math.max(newPosition.x - 1, 0);
    } else if (key === 'ArrowRight') {
      newPosition.x = Math.min(newPosition.x + 1, DUNGEON_SIZE - 1);
    }
  
    // Verificar colisão com as paredes ('#') antes de atualizar a posição
    if (dungeon[newPosition.y][newPosition.x] !== '#') {
      setPlayerPosition(newPosition);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [playerPosition]);

  return (
    <div className={styles.gameContainer}>
      <h1>Calabouço Crawler</h1>
      {dungeon.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map((cell, columnIndex) => (
            <span key={columnIndex} className={styles.cell}>{playerPosition.x === columnIndex && playerPosition.y === rowIndex ? 'P' : cell}</span>
          ))}
        </div>
      ))}
    </div>
  );
}