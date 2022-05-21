class Game{

    constructor(){
        this.root = this.basename(document.querySelector('root').innerHTML)
        this.assets = `../public/assets`
        this.main();
    }

    main(){
        // all images pixelated
        setInterval(() => {
            let allImgs = document.querySelectorAll('img');
            Array.from(allImgs).map(img => {
                img.style.imageRendering = 'pixelated'
            });

        }, 3000)

        // set map size
        let scene = document.querySelector('.cenario')
        
        this.play_music("default.ogg");

        this.player_songs();
        
    }

    // set player songs
    player_songs() {
        document.onkeydown = (e) => {

            // salto
            if(["Space", "ArrowUp", "KeyW"].indexOf(e.code) > -1) this.play_song('smb_jump-small.wav')
            
        };
    }

    play_song(src) {
        let sound = document.createElement('audio');
        sound.src = `./${this.assets}/soundtrack/${src}`
        sound.autoplay = true;
        sound.play()
    }

    play_music(src){
        let sound = document.createElement('audio');
        sound.src = `./${this.assets}/soundtrack/${src}`
        sound.autoplay = true;
        sound.play()
        // sound.crossOrigin = 'anonymous';
        sound.volume = 0.4
        document.body.appendChild(sound)
        let buttonAudio = document.querySelector('button#audio')
        buttonAudio.dataset.target = 'play'
        let img = buttonAudio.querySelector('img');

        img.onclick = buttonAudio.click()
        
        buttonAudio.onclick = function(e){
            if(buttonAudio.dataset.target == 'play'){
                buttonAudio.dataset.target = 'stop'
                sound.pause()
            }else{
                buttonAudio.dataset.target = 'play'
                sound.play()
            }
        }
    }

    basename(path) {
        return path.split(/[\\/]/).pop();;
     }

}

window.onload = function(){
    let imgs = document.querySelectorAll('img')
    imgs.forEach(img => {
        img.draggable = false
    })

    const game = new Game();
    
}

