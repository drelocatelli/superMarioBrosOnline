import Service from './service';

class Game {
    constructor() {
        this.disableKeyScrolling();
        Service.sockets.player.listen().connection();
        Service.sockets.player.listen().keyboards();
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
