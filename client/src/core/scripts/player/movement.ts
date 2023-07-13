import Platform from '../platform';
import Service from '../service';
import doWhenWin from './doWhenWin';
import Player from './player';
import useGlobalState, { IUseGlobalState } from '@core/store/global';

function Movement(this: Player) {
    const { game: gameState, decrementPlatformPositionX }: IUseGlobalState = useGlobalState();

    const gravity = () => {
        this.position.y += this.speed.y;
        this.position.x += this.speed.x;
        if (gameState.stage)
            if (this.position.y + this.height + this.speed.y <= gameState.stage.height()) this.speed.y += Player.defaultProps.gravity;
            else this.speed.y = 0;
    };

    const resetPosition = () => {
        // Verificar se a posição atual ultrapassou a largura do canvas
        if (this.position.x > this.canvas.offsetWidth) {
            this.position.x = 0;
            this.screenLevel += 1;
            this.keys.left.pressed = false;
        } else if (this.position.x <= 0 && this.canReturnBack) {
            if (this.screenLevel >= 1) {
                this.screenLevel -= 1;
            } else if (this.screenLevel == 0) {
                return;
            }
            this.position.x = this.canvas.offsetWidth;
            this.keys.right.pressed = false;
        }
    };

    const scrollMoviment = () => {
        if (this.keys.right.pressed) {
            this.scrollOffset += Player.defaultProps.stop_speed;

            if (this.scrollOffset === gameState.winPositionX) {
                doWhenWin.call(this);
                this.keys.right.pressed = false;
            }
            resetPosition();
        } else if (this.keys.left.pressed) {
            this.scrollOffset += Player.defaultProps.stop_speed;
            if (this.canReturnBack) {
                resetPosition();
            }
        }
    };

    const moveBackground = () => {
        gameState.platforms.forEach((platform: Platform, i: number) => {
            if (this.keys.right.pressed) {
                decrementPlatformPositionX(i, this.speed.x);
            } else if (this.canReturnBack && this.keys.left.pressed) {
                if (platform.initialPosition.x !== platform.element?.position().x) {
                    decrementPlatformPositionX(i, this.speed.x);
                }
            }
        });
        scrollMoviment();
    };

    const animate = () => {
        this.animId = requestAnimationFrame(this.animate.bind(this));
        gameState.platforms.forEach((platform: Platform) => platform.draw());
        this.update();

        this.elements = this.elements!;
        this.currentPosition = this.currentPosition!;

        // current player always on top
        if (this.currentPlayer && this.elements) {
            let currentElement = this.elements[this.elements.length - 1];
            if (currentElement) {
                currentElement.zIndex(currentElement.zIndex() + 1);
            }
        }
        // move platform with keys
        if (this.firstPlayerMoveBgPosition) {
            if (this.id === Service.sockets.player.first().id) moveBackground();
        } else {
            moveBackground();
        }

        if (this.keys.right.pressed) {
            this.speed.x = Player.defaultProps.stop_speed;
        } else this.speed.x = 0;
    };

    return {
        animate,
        gravity,
    };
}

export default Movement;