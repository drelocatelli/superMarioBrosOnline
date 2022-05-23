import { createRef } from "react";
import { useEffect } from "react"

export default function Frame(level) {
    var game = createRef()

    useEffect(() => {
        game.current.focus()
    }, [])

    return <iframe src="./level/1" id="game" ref={game} frameBorder="0" width=""></iframe>
}