(function() {
    let scene = document.querySelector('.cenario')

    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 200)

    let level = document.title.match(/[0-9]{1,2000}/)[0]
    level = parseInt(level);

    setMaxEdge()
    
    // if(level === 1) {
    //     scene.style.width = `${mapSize}px`;
    //     scene.style.position = 'absolute'
    //     scene.style.backgroundSize = '50px'
    // }

    
 })();

 function setMaxEdge() {
    let maxEdge = document.createElement('div')
    maxEdge.classList.add('maxEdge')
    maxEdge.style.position = 'absolute'
    maxEdge.style.right = '0'
    maxEdge.style.bottom = '11%'
    maxEdge.style.height = '11vh'
    maxEdge.style.width = '11px'
    
    document.body.appendChild(maxEdge)

    console.log(maxEdge.getBoundingClientRect().left)
 }
