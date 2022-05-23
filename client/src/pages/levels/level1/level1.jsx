import { useEffect } from 'react';
import { initialize, CreateScene } from '../basic/basic';
import kaboom from 'kaboom';
import '../basic/basic.css';
import './level1.css';

export default function Level1() {
    
    useEffect(() => {
        initialize()
        game()
    }, [])
    
    return <Scene />
}

function game() {

    const k = kaboom({
        global: true,
        background: [142, 143, 246],
        canvas: document.querySelector("#mycanvas"),
    })

    k.loadRoot('/assets/sprites/')
    k.loadSprite('terrain-2', 'terrain-2.png')
    k.loadSprite('mario-1', 'mario-1.png')
    k.loadSprite('luigi-1', 'luigi-1.png')
    k.loadSprite('mountain-2', 'mountain-2.png')

    k.scene('game', () => {
        k.layer(['bg', 'obj', 'ui'], 'obj')

        const map = [
            '                                        ',
            '                                        ',
            '                                        ',
            '                                        ',
            '                                        ',
            '                                        ',
            '                                        ',
            '                                        ',
            '                                        ',
            '                                        ',
            '                                        ',
            '                                        ',
            '                                        ',
            '                                        ',
            '                                        ',
            '   ^^                                     ',
            '========================================',
        ]


        const levelCfg = {
            width: 30,
            height: 30,
            '=': () => [
                k.sprite('terrain-2'), 
                k.solid(),
                k.area(),
            ],
            // '^': () => [
            //     k.sprite('mountain-2'),
            //     k.pos(0, 10),
            // ]
        }
        
        k.add([
            k.sprite('mountain-2'),
            k.scale(1.5),
        ])

        k.addLevel(map, levelCfg)
    })

    k.go('game')
    
}

function Scene() {
    return( <CreateScene /> )
}