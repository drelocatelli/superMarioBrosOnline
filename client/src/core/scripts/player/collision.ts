import Platform from '../platform';
import Player from './player';
import useGlobalState from '@core/store/global';

function Collision(this: Player) {
    const { game: gameState } = useGlobalState();

    // edge collision
    this.currentPosition = this.currentPosition!;

    // top edge collision
    if (this.currentPosition.y < gameState.stage.position().y) {
        this.position.y = 0;
        this.speed.y = 0;
    }

    // left edge collision
    if (
        this.keys.left.pressed &&
        this.currentPosition.x >= Player.defaultProps.speed &&
        this.currentPosition.x >= gameState.stage.position().x + 10
    ) {
        this.speed.x = -Player.defaultProps.stop_speed;
    }

    // platform collision detection
    gameState.platforms.forEach((platform: Platform) => {
        if (platform.element) {
            // horizontal or vertical platform movement block
            if (platform.block == 'vertically' && this.position.x <= platform.element.x()) {
                this.position.x = platform.element.x();
            }
            if (
                this.position.y + this.height <= platform.element.y() &&
                this.position.y + this.height + this.speed.y >= platform.element.y() &&
                this.position.x + this.width >= platform.element.x() &&
                this.position.x <= platform.element.x() + platform.width
            ) {
                this.speed.y = 0;
            }
        }
    });
}

export default Collision;
