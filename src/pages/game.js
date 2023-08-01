import { useState } from 'react';
import styles from '../../styles/game.module.css';

const dungeonWidth = 20;
const dungeonHeight = 10;

const initialDungeon = [
    '####################',
    '#..................#',
    '#..................#',
    '#....#.............#',
    '#....#.............#',
    '#....#.............#',
    '#..................#',
    '#..................#',
    '####################'
];

export default function Game() {
  const [ dungeon, setDungeon ] = useState(initialDungeon);
  const [ playerPosition, setPlayerPosition ] = useState({ x: 1, y: 1 })

  const handleKeyPress = (event) => {
    const { key } = event;
    const { x, y } = playerPosition;

    if (key === 'ArrowUp' && dungeon[y - 1][x] === '.') {
        setPlayerPosition({ x, y: y - 1});
    } else if (key === 'ArrowDown' && dungeon[y + 1][x] === '.') {
        setPlayerPosition({x, y: y + 1});
    } else if (key === 'ArrowLeft' && dungeon[y][x - 1] === '.') {
        setPlayerPosition({ x: x - 1, y});
    } else if (key === 'ArrowRight' && dungeon[y][x + 1] === '.') {
        setPlayerPosition({x: x + 1, y});
    }
  }

  return (
    <div className={styles.gameContainer} tabIndex={0} onKeyDown={handleKeyPress}>
      <h1>Calabouço Crawler</h1>
      {dungeon.map((row, y) => (
        <div key={y} className={styles.row}>
            {row.split('').map((cell, x) => (
                <span key={x} className={styles.cell}>
                    {playerPosition.x === x && playerPosition.y === y ? 'P' : cell}
                </span>
            ))}
        </div>
      ))}
    </div>
  );
}