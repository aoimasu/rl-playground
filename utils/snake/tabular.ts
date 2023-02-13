import {
  checkBounds,
  delay,
  DIRS,
  DISCOUNT_FACTOR,
  manhattanDist,
  moveSnake,
} from "./environment"

/*
  State definition:
      surr = 4 cells around the head  LURD
      dir = relative pos of the apple (8 possible vals 0 - 7)
*/
export const getState = (dots: any[], food: any[]) => {
  var surr = [0, 0, 0, 0]
  var dir = 0
  var head = dots[dots.length - 1]
  var relx = head[0] - food[0]
  var rely = head[1] - food[1]

  if (relx < 0 && rely < 0) dir = 6
  else if (relx === 0 && rely < 0) dir = 5
  else if (relx > 0 && rely < 0) dir = 4
  else if (relx > 0 && rely === 0) dir = 3
  else if (relx > 0 && rely > 0) dir = 2
  else if (relx === 0 && rely > 0) dir = 1
  else if (relx < 0 && rely > 0) dir = 0
  else if (relx < 0 && rely === 0) dir = 7

  for (var index = 0; index < 4; index++) {
    if (checkBounds([head[0] + DIRS[index][0], head[1] + DIRS[index][1]])) {
      surr[index] = 1
    } else {
      dots.forEach((dot, i) => {
        if (i <= dots.length - 2) {
          if (
            dot[0] === head[0] + DIRS[index][0] &&
            dot[1] === head[1] + DIRS[index][1]
          )
            surr[index] = 1
        }
      })
    }
  }

  return [surr, dir]
}

const chooseAction = (
  Q: any,
  epsilon: number,
  state: (number | number[])[] | [any, any]
) => {
  const [surr, dir] = state
  const v1 = surr[0] + 2 * surr[1] + 4 * surr[2] + 8 * surr[3]
  if (Math.random() < epsilon) {
    return Math.floor(Math.random() * 4)
  } else {
    var mx = -100000,
      ind = 0
    for (var i = 0; i < 4; i++) {
      if (Q[dir][v1][i] > mx) {
        mx = Q[dir][v1][i]
        ind = i
      }
    }
    return ind
  }
}

const getReward = (dots: any, food: any, dist: number, done: boolean) => {
  var head = dots[dots.length - 1]
  if (done) return -100
  else if (head[0] === food[0] && head[1] === food[1]) return 30
  else if (manhattanDist(food, head) < dist) return 1
  else return -5
}

const updateQTable = (
  Q: any,
  done: boolean,
  state: (number | number[])[] | [any, any],
  nextState: (number | number[])[] | [any, any],
  reward: number,
  action: number
) => {
  const [surr, dir] = state
  const v1 = surr[0] + 2 * surr[1] + 4 * surr[2] + 8 * surr[3]
  const [nextSurr, nextDir] = nextState
  const nextV1 =
    nextSurr[0] + 2 * nextSurr[1] + 4 * nextSurr[2] + 8 * nextSurr[3]
  let mx

  if (!done) {
    mx = -100000
    for (var i = 0; i < 4; i++) {
      if (Q[nextDir][nextV1][i] >= mx) {
        mx = Q[nextDir][nextV1][i]
      }
    }
  } else mx = 0

  Q[dir][v1][action] +=
    0.01 * (reward + DISCOUNT_FACTOR * mx - Q[dir][v1][action])

  return Q
}

export const qLearning = async (gameState: any) => {
  const { Q, gameOver, dots, food, epsilon } = gameState
  if (!gameOver) {
    // Get the current state
    let state = getState(dots, food)

    // Choose an action based on the current state
    let action = chooseAction(Q, epsilon, state)
    const distBeforeMove = manhattanDist(food, dots[dots.length - 1])

    // Take the action and observe the next state and reward
    let newDots: any = moveSnake(action, dots, food)
    let nextState = getState(newDots?.[0] ?? dots, newDots?.[1] ?? food)
    let reward = getReward(
      newDots?.[0] ?? dots,
      newDots?.[1] ?? food,
      distBeforeMove,
      !newDots
    )
    await delay(1)
    // Update the Q-value for the current state-action pair
    let newQ = updateQTable(Q, !newDots, state, nextState, reward, action)
    return {
      ...gameState,
      Q: newQ,
      gameOver: !newDots,
      dots: newDots?.[0] ?? dots,
      food: newDots?.[1] ?? food,
    }
  }
  return gameOver ? gameState : { ...gameState, gameOver: true }
}
