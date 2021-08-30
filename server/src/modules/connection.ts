import io from "socket.io";
import { auth } from "firebase-admin";
import { useAuthToken } from "../hooks/socketHooks";

export default class ConnectionManager
{
    private readonly connection = "connection";
    private connections: Map<string, io.Socket> = new Map();

    constructor( server: io.Server )
    {
        server.on( this.connection, async socket =>
        {
            this.connections.set( socket.id, socket );

            const token = await useAuthToken( socket );
            const user = await auth().getUser( token.uid );

            console.log( `${socket.id} successfully connected from user ${user.displayName}|${user.uid}` );
            socket.on( "disconnect", disconnectMessage =>
            {
                console.log( `${socket.id} disconnected (${disconnectMessage})` );
            } );
        } );
    }
}