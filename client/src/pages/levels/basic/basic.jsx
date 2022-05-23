import { SERVER, socket } from "../../../socket/connection"
import { connect, setPublicIp } from "./server_connection"

export async function initialize() {
    setPublicIp();

    // do login
    connect();
}