import styles from "@/styles/snake.module.css"
import { useEffect, useState } from "react"

const Food = (props: { food: any[] }) => {
  const [style, setStyle] = useState<any>({})
  useEffect(
    () =>
      setStyle({
        left: `${props.food[0]}%`,
        top: `${props.food[1]}%`,
      }),
    [props.food]
  )

  return <div className={styles.foodDot} style={style}></div>
}
export default Food
