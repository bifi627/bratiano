export function useBasicAuth( authorization: string )
{
    const basic = authorization.split( " " )[ 1 ];
    const buff = Buffer.from( basic, "base64" );
    const decoded = buff.toString( "utf-8" ).split( ":" );
    return { username: decoded[ 0 ], password: decoded[ 1 ] };
}

export function useBearerToken( authorization: string )
{
    const token = authorization.split( " " )[ 1 ];
    return { token: token };
}