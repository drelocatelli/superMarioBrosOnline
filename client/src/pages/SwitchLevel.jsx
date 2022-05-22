import {useParams} from 'react-router-dom'

export default function Level() {

    const {level} = useParams();

    switch(level) {
        case '1':
            return <Level1 />
        break;
        default:
            return(<>Esse level não existe</>)
    }
    
}

function Level1() {
    return(<>ola mundo</>)
}