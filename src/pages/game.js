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

const getRandomRoom = (rooms) => {
  return rooms[getRandomInt(0, rooms.length - 1)];
};

const createCorridor = (dungeon, x1, y1, x2, y2) => {
    let x = x1;
    let y = y1;
  
    while (x !== x2) {
      x += x < x2 ? 1 : -1;
      dungeon[y][x] = '.';
    }
  
    while (y !== y2) {
      y += y < y2 ? 1 : -1;
      dungeon[y][x] = '.';
    }
  };

const generateRandomDungeon = () => {
  const dungeon = createEmptyDungeon();
  const rooms = [];

  // Gerar salas
  for (let i = 0; i < 5; i++) {
    const roomWidth = getRandomInt(4, 8);
    const roomHeight = getRandomInt(4, 8);
    const roomX = getRandomInt(1, DUNGEON_SIZE - roomWidth - 1);
    const roomY = getRandomInt(1, DUNGEON_SIZE - roomHeight - 1);
    createRoom(dungeon, roomX, roomY, roomWidth, roomHeight);
    rooms.push({ x: roomX, y: roomY, width: roomWidth, height: roomHeight });
  }

  // Gerar corredores
  const connectedRooms = [rooms[0]];
  for (let i = 1; i < rooms.length; i++) {
    const prevRoom = getRandomRoom(connectedRooms);
    const room = rooms[i];
    createCorridor(dungeon, prevRoom.x + Math.floor(prevRoom.width / 2), prevRoom.y + Math.floor(prevRoom.height / 2), room.x + Math.floor(room.width / 2), room.y + Math.floor(room.height / 2));
    connectedRooms.push(room);
  }

  return dungeon;
};

export default function Game() {
  const [dungeon, setDungeon] = useState([]);
  const [playerPosition, setPlayerPosition] = useState({ x: 15, y: 15 });

  useEffect(() => {
    const initializeGame = () => {
      const newDungeon = generateRandomDungeon();
      // Posicionar o jogador (P) em uma posição válida que não seja parede ('#') ou saída ('E')
      let playerX, playerY;
      do {
        playerX = getRandomInt(0, DUNGEON_SIZE - 1);
        playerY = getRandomInt(0, DUNGEON_SIZE - 1);
      } while (
        newDungeon[playerY][playerX] === '#' ||
        newDungeon[playerY][playerX] === 'E' ||
        newDungeon[playerY][playerX] === 'P'
      ); // Evitar que o jogador nasça em posições ocupadas por parede, saída ou outro jogador
      newDungeon[playerY][playerX] = 'P'; // Posicionar o jogador na masmorra
      setDungeon(newDungeon);
      setPlayerPosition({ x: playerX, y: playerY });
    };

    initializeGame();
  }, []);

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
          // Limpar a posição anterior do jogador
          const updatedDungeon = [...dungeon];
          updatedDungeon[playerPosition.y][playerPosition.x] = '.';
          // Atualizar a posição do jogador no estado
          setPlayerPosition(newPosition);
          // Atualizar a nova posição do jogador na masmorra
          updatedDungeon[newPosition.y][newPosition.x] = 'P';
          setDungeon(updatedDungeon);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [dungeon, playerPosition]);

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