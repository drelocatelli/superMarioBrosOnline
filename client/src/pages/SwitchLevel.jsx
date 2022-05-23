import { useEffect } from 'react';
import {useParams} from 'react-router-dom'
import socket from '../socket/connection'

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

    useEffect(() => {
        console.log(socket)
        socket.on('login', action => {
            console.log('connected')
        })
    }, [])
    
    return(<>ola mundo</>)
}