let SERVER = "";

export function setServer( server: string )
{
    SERVER = server;
    validateServer();
}

export function getServer()
{
    validateServer();
    return SERVER;
}

function validateServer()
{
    if ( SERVER === "" )
    {
        throw new Error( "Server not set." );
    }
}