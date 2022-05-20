(function() {
    let scene = document.querySelector('.cenario')

    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 200)

    let level = document.title.match(/[0-9]{1,2000}/)[0]
    level = parseInt(level);

    // if(level === 1) {
    //     scene.style.width = `${mapSize}px`;
    //     scene.style.position = 'absolute'
    //     scene.style.backgroundSize = '50px'
    // }

    
 })();
