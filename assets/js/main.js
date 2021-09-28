class Game{

    constructor(){
        this.main();
    }

    main(){
        this.play_song("default.mp3");
      
    }

    play_song(src){
        let sound = document.createElement('audio');
        sound.src = `assets/soundtrack/${src}`
        sound.autoplay = true;
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
                img.src = 'assets/controls/mute.png'
                sound.pause()
            }else{
                buttonAudio.dataset.target = 'play'
                img.src = 'assets/controls/sound.png'
                sound.play()
            }
        }
    }

}

window.onload = function(){
    const game = new Game();
}

