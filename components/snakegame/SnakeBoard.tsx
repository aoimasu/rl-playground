import styles from "@/styles/snake.module.css"
import { genCoords } from "@/utils/snake/environment"
import { qLearning } from "@/utils/snake/tabular"
import { useEffect, useState } from "react"
import Food from "./Food"
import SnakeDot from "./SnakeDot"

// https://github.com/sid-sr/Q-Snake/blob/2e13f2a35a8bbd9305c8083b8a44b1bc3e12da3d/src/Board.js

const MAX_EPISODES = 1000
const START_EPSILON = 0.1
const MIN_EPSILON = 0.01
const EPSILON_DECAY = (START_EPSILON - MIN_EPSILON) / MAX_EPISODES

export const SnakeBoard = () => {
  const [highScore, setHighScore] = useState(0)
  const [gameState, setGameState] = useState<any>({
    dots: [genCoords()],
    food: genCoords(),
    gameOver: false,
    episode: 1,
    epsilon: START_EPSILON,
    Q: [],
  })

  useEffect(() => {
    var arr = []
    for (var i = 0; i < 8; i++) {
      var oth = []
      for (var j = 0; j < 16; j++) {
        oth.push([0, 0, 0, 0])
      }
      arr.push(oth)
    }
    setGameState({ ...gameState, Q: arr })
  }, [])

  const runTraining = async () => {
    const newState = await qLearning(gameState)
    if (newState.gameOver) {
      if (highScore < newState.dots.length) {
        console.log(newState.episode, newState.dots.length)
        setHighScore(newState.dots.length)
      }
      let newEps =
        newState.epsilon - EPSILON_DECAY >= MIN_EPSILON
          ? newState.epsilon - EPSILON_DECAY
          : MIN_EPSILON
      setGameState({
        ...newState,
        episode: newState.episode + 1,
        epsilon: newEps,
        gameOver: false,
        dots: [genCoords()],
        food: genCoords(),
      })
    } else {
      setGameState(newState)
    }
  }

  useEffect(() => {
    if (gameState.Q.length === 0 || gameState.episode > MAX_EPISODES) return
    runTraining()
  }, [gameState])

  return (
    <div className={styles.boardArea}>
      <SnakeDot snakeDots={gameState.dots} direction={2} />
      <Food food={gameState.food} />
    </div>
  )
}
