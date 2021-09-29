class Game{

    constructor(){
        this.root = this.basename(document.querySelector('root').innerHTML)
        this.assets = `../public/assets`
        this.main();
    }

    main(){
        this.play_song("default.mp3");
    }

    play_song(src){
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

