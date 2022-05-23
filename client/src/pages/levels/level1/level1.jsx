import { useEffect } from 'react';
import socket from '../../../socket/connection'

export default function Level1() {

    useEffect(() => {
        console.log('ola mundo')
        
        socket.on('login', action => {
            console.log('connected')
        })
    }, [])
    
    return(<>ola mundo</>)
}