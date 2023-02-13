export const DISCOUNT_FACTOR = 1

export const delay = (ms: number | undefined) =>
  new Promise((res) => setTimeout(res, ms))

export const genCoords = () => {
  return [
    Math.floor(Math.random() * 20) * 5,
    Math.floor(Math.random() * 20) * 5,
  ]
}
export const manhattanDist = (p1: number[], p2: number[]) => {
  return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1])
}
export const DIRS = [
  [-5, 0], // 0 - left
  [0, -5], // 1 - down
  [5, 0], // 2 - right
  [0, 5], // 3 - up
]

export const checkBounds = (head: number[]) => {
  return head[0] < 0 || head[0] > 95 || head[1] < 0 || head[1] > 95
}
export const checkBorders = (dots: any[]) => {
  var head = dots[dots.length - 1]
  if (checkBounds(head)) {
    return true
  }
  return false
}
export const checkCollapsed = (dots: any[]) => {
  // in edge case that snake has 2 dots, compare the new 3rd dot with the tail
  if (dots.length === 3) {
    return dots[0][0] === dots[2][0] && dots[0][1] === dots[2][1]
  }

  var lost = false
  var head = dots[dots.length - 1]
  dots.forEach((dot, i) => {
    if (
      i !== 0 &&
      i !== dots.length - 1 &&
      head[0] === dot[0] &&
      head[1] === dot[1]
    ) {
      lost = true
    }
  })

  return lost
}

/**
 * Make move with direction
 * @param dir
 * @returns true if game over, false otherwise
 */
export const moveSnake = (dir: number, dots: any[], food: any[]) => {
  let newx = dots[dots.length - 1][0]
  let newy = dots[dots.length - 1][1]
  let foodFound = false
  let valid = true

  newx += DIRS[dir][0]
  newy += DIRS[dir][1]

  if (newx === food[0] && newy === food[1]) {
    while (true) {
      valid = true
      food = genCoords()
      dots.forEach((dot, i) => {
        if (dot[0] === food[0] && dot[1] === food[1]) {
          valid = false
        }
      })
      if (valid) break
    }
    //if(state.speed > 20) state.speed -= 10;
    foodFound = true
  }
  dots.push([newx, newy])
  if (checkBorders(dots) || checkCollapsed(dots)) {
    return undefined
  } else {
    if (!foodFound) dots.shift()
    return [dots, food, dir]
  }
}
