import { useEffect, useState } from 'react';
import styles from '../../styles/game.module.css';

const DUNGEON_SIZE = 30;

const createEmptyDungeon = () => {
  const dungeon = [];
  for (let i = 0; i < DUNGEON_SIZE; i++) {
    const row = new Array(DUNGEON_SIZE).fill('#');
    dungeon.push(row);
  }
  return dungeon;
};

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const createRoom = (dungeon, x, y, width, height) => {
  for (let i = y; i < y + height; i++) {
    for (let j = x; j < x + width; j++) {
      dungeon[i][j] = '.';
    }
  }
};

const createCorridor = (dungeon, x1, y1, x2, y2) => {
  let x = x1;
  let y = y1;
  while (x !== x2 || y !== y2) {
    if (x !== x2) {
      x += x < x2 ? 1 : -1;
    }
    if (y !== y2) {
      y += y < y2 ? 1 : -1;
    }
    dungeon[y][x] = '.';
  }
};

const generateRandomDungeon = () => {
    const dungeon = createEmptyDungeon();
  
    // Gerar salas
    for (let i = 0; i < 5; i++) {
      const roomWidth = getRandomInt(4, 8);
      const roomHeight = getRandomInt(4, 8);
      const roomX = getRandomInt(1, DUNGEON_SIZE - roomWidth - 1);
      const roomY = getRandomInt(1, DUNGEON_SIZE - roomHeight - 1);
      createRoom(dungeon, roomX, roomY, roomWidth, roomHeight);
    }
  
    // Gerar corredores
    const rooms = [{ x: 0, y: 0 }];
    for (let i = 1; i < 5; i++) {
      const prevRoom = rooms[i - 1];
      const room = { x: getRandomInt(1, DUNGEON_SIZE - 1), y: getRandomInt(1, DUNGEON_SIZE - 1) };
      rooms.push(room);
      createCorridor(dungeon, prevRoom.x, prevRoom.y, room.x, room.y);
    }
  
    return dungeon;
  };

  export default function Game() {
    const [dungeon, setDungeon] = useState([]);
    const [playerPosition, setPlayerPosition] = useState({ x: 15, y: 15 });
  
    useEffect(() => {
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
    
          // Verificar se a posição é válida antes de atualizar o estado
          if (
            newPosition.y >= 0 &&
            newPosition.y < DUNGEON_SIZE &&
            newPosition.x >= 0 &&
            newPosition.x < DUNGEON_SIZE &&
            dungeon[newPosition.y][newPosition.x] !== '#'
          ) {
            // Verificar encontro com inimigos ('E')
            if (dungeon[newPosition.y][newPosition.x] === 'E') {
              // Derrota: o jogador encontrou um inimigo
              alert('Você foi derrotado! O inimigo te pegou!');
              // Reiniciar o jogo
              setDungeon(generateRandomDungeon());
              setPlayerPosition({ x: 0, y: 0 });
            } else {
              // Atualizar a posição do jogador no estado
              setPlayerPosition(newPosition);
            }
          }
        };
    
        window.addEventListener('keydown', handleKeyPress);
        return () => {
          window.removeEventListener('keydown', handleKeyPress);
        };
      }, [dungeon, playerPosition]);
    
      useEffect(() => {
        setDungeon(generateRandomDungeon());
      }, []);
  
    return (
      <div className={styles.gameContainer}>
        <h1>Calabouço Crawler</h1>
        {dungeon.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((cell, columnIndex) => (
              <span key={columnIndex} className={`${styles.cell} ${cell === 'E' ? styles.enemy : ''}`}>
                {playerPosition.x === columnIndex && playerPosition.y === rowIndex ? 'P' : cell}
              </span>
            ))}
          </div>
        ))}
      </div>
    );
  };