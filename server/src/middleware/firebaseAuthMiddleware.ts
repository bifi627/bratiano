import io from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { useAuthToken } from "../hooks/socketHooks";

export async function firebaseAuthMiddleware( socket: io.Socket<DefaultEventsMap, DefaultEventsMap>, next: ( error?: ExtendedError | undefined ) => void )
{
    try
    {
        await useAuthToken( socket );
        next();
    }
    catch ( error: any )
    {
        console.error( error );
        next( new Error( error.message ) );
    }
}
