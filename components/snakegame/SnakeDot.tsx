import styles from "@/styles/snake.module.css"
import { useEffect, useState } from "react"

const getHeadBorder = (direction: number) => {
  if (direction === 0) return "Left"
  if (direction === 1) return "Bottom"
  if (direction === 2) return "Right"
  return "Top"
}
const SnakeDot = (props: { snakeDots: any[]; direction: number }) => {
  const [dotStyles, setDotStyle] = useState<any>([])
  useEffect(() => {
    const border = getHeadBorder(props.direction)
    setDotStyle(
      props.snakeDots.map((dot: any[], i: any) => {
        let base: any = {
          left: `${dot[0]}%`,
          top: `${dot[1]}%`,
        }
        return base
      })
    )
  }, [props])

  return (
    <div>
      {dotStyles.map((style: any, i: number) => (
        <div className={styles.boardDot} key={i} style={style}></div>
      ))}
    </div>
  )
}

export default SnakeDot
