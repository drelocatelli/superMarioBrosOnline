import Sockets from './sockets/main';

class Game extends Sockets {
    constructor() {
        super();
        this.disableKeyScrolling();
        this.sockets.player.listen().connection();
        this.sockets.player.initialAnimation();
        this.sockets.player.listen().keyboards();
    }

    disableKeyScrolling() {
        // disable keys scrolling
        window.addEventListener(
            'keydown',
            function (e) {
                if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD'].indexOf(e.code) > -1) {
                    e.preventDefault();
                }
            },
            false,
        );
    }
}

export default Game;
