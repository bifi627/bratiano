import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Socket } from "socket.io";
import { auth } from "firebase-admin";

export async function useAuthToken( socket: Socket<DefaultEventsMap, DefaultEventsMap> )
{
    const token = socket.handshake.auth[ "token" ];
    if ( token === undefined || token === "" )
    {
        throw new Error( "No authentication token received" );
    }
    return await auth().verifyIdToken( token );
}

export async function useIdToken( idToken: string )
{
    if ( idToken === undefined || idToken === "" )
    {
        throw new Error( "No authentication token received" );
    }
    return await auth().verifyIdToken( idToken );
}

