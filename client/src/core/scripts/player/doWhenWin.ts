import Player from './player';

/*
/ set win place in src/core/store/globals.ts 
/ the variable is called winPositionX
*/
function doWhenWin(this: Player) {
    console.log('You win!');
}

export default doWhenWin;
