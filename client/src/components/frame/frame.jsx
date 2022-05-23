import { createRef, useEffect } from "react";

export default function Frame(level) {
  let game = createRef()

  useEffect(() => {
    game.current.focus()
  }, [game])

  return (
    <iframe
      id="game"
      title="scene"
      ref={game}
      src="./level/1"
      frameBorder="0"
      width=""
    />
  )
}
