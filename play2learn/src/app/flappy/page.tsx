"use client"
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Bird } from 'lucide-react';

interface Obstacle {
    x: number;
    height: number;
    speed: number;
}

function loading() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [birdHeight, setBirdHeight] = useState(300);
    const [birdVelocity, setBirdVelocity] = useState(0);
    const [obstacles, setObstacles] = useState<Obstacle[]>([]);

    const gameLoopRef = useRef<number>();
    const lastObstacleSpawnRef = useRef(0);

    const BIRD_SIZE = 40;
    const GAME_HEIGHT = 600;
    const OBSTACLE_WIDTH = 50;
    const SPAWN_INTERVAL = 2000;
    const GRAVITY = 0.6;
    const JUMP_FORCE = -12;
    const BIRD_X_POSITION = 100;

    const handleKeyPress = useCallback((e: KeyboardEvent) => {
        if (e.code === 'Space') {
            if (!isPlaying) {
                startGame();
            } else {
                setBirdVelocity(JUMP_FORCE);
            }
        }
    }, [isPlaying]);

    const startGame = () => {
        setIsPlaying(true);
        setGameOver(false);
        setScore(0);
        setObstacles([]);
        setBirdHeight(300);
        setBirdVelocity(0);
    };

    const spawnObstacle = () => {
        const newObstacle: Obstacle = {
            x: window.innerWidth,
            height: Math.random() * (GAME_HEIGHT - 200) + 100,
            speed: 5
        };
        setObstacles(prev => [...prev, newObstacle]);
    };

    const updateGame = useCallback(() => {
        if (!isPlaying) return;

        const now = Date.now();
        if (now - lastObstacleSpawnRef.current > SPAWN_INTERVAL) {
            spawnObstacle();
            lastObstacleSpawnRef.current = now;
        }

        // Update bird position
        setBirdHeight(prev => {
            const newHeight = prev + birdVelocity;
            if (newHeight <= BIRD_SIZE/2 || newHeight >= GAME_HEIGHT - BIRD_SIZE/2) {
                setGameOver(true);
                setIsPlaying(false);
                setHighScore(current => Math.max(current, score));
                return prev;
            }
            return newHeight;
        });

        // Update bird velocity (gravity)
        setBirdVelocity(prev => prev + GRAVITY);

        // Update obstacles
        setObstacles(prevObstacles => {
            const newObstacles = prevObstacles
                .map(obstacle => ({ ...obstacle, x: obstacle.x - obstacle.speed }))
                .filter(obstacle => obstacle.x > -OBSTACLE_WIDTH);

            // Check collisions
            const collision = newObstacles.some(obstacle => {
                const birdRight = BIRD_X_POSITION + BIRD_SIZE/2;
                const birdLeft = BIRD_X_POSITION - BIRD_SIZE/2;
                const obstacleLeft = obstacle.x;
                const obstacleRight = obstacle.x + OBSTACLE_WIDTH;

                const horizontalCollision =
                    birdRight > obstacleLeft && birdLeft < obstacleRight;

                const verticalCollision =
                    Math.abs(birdHeight - obstacle.height) < BIRD_SIZE;

                return horizontalCollision && verticalCollision;
            });

            if (collision) {
                setGameOver(true);
                setIsPlaying(false);
                setHighScore(current => Math.max(current, score));
                return [];
            }

            return newObstacles;
        });

        setScore(prev => prev + 1);
        gameLoopRef.current = requestAnimationFrame(updateGame);
    }, [isPlaying, birdVelocity, score]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    useEffect(() => {
        if (isPlaying) {
            gameLoopRef.current = requestAnimationFrame(updateGame);
        } else if (gameLoopRef.current) {
            cancelAnimationFrame(gameLoopRef.current);
        }
        return () => {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        };
    }, [isPlaying, updateGame]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-600 flex flex-col items-center justify-center">
            <div className="relative w-full h-[600px] bg-sky-100 overflow-hidden">
                {/* Bird */}
                <div
                    className="absolute transition-transform"
                    style={{
                        left: `${BIRD_X_POSITION}px`,
                        top: `${birdHeight}px`,
                        transform: `translateY(-50%) rotate(${birdVelocity * 3}deg)`,
                        transition: 'transform 0.1s'
                    }}
                >
                    <Bird size={BIRD_SIZE} className="text-blue-600" />
                </div>

                {/* Obstacles */}
                {obstacles.map((obstacle, index) => (
                    <div
                        key={index}
                        className="absolute bg-green-600"
                        style={{
                            left: `${obstacle.x}px`,
                            top: `${obstacle.height}px`,
                            width: `${OBSTACLE_WIDTH}px`,
                            height: '20px'
                        }}
                    />
                ))}

                {/* Game Over Screen */}
                {gameOver && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                        <div className="bg-white p-8 rounded-lg text-center">
                            <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
                            <p className="text-xl mb-2">Score: {score}</p>
                            <p className="text-xl mb-4">High Score: {highScore}</p>
                            <button
                                onClick={startGame}
                                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                            >
                                Play Again
                            </button>
                        </div>
                    </div>
                )}

                {/* Start Screen */}
                {!isPlaying && !gameOver && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                        <div className="bg-white p-8 rounded-lg text-center">
                            <h1 className="text-3xl font-bold mb-4">Flying Bird</h1>
                            <p className="mb-4">Press SPACE to jump and avoid obstacles</p>
                            <button
                                onClick={startGame}
                                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                            >
                                Start Game
                            </button>
                        </div>
                    </div>
                )}

                {/* Score */}
                <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-lg">
                    <p className="text-xl font-bold">Score: {score}</p>
                </div>
            </div>
        </div>
    );
}

export default loading;