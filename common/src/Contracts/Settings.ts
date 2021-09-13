
export function createAutherizedRequest( idToken: string )
{
    return {
        headers: {
            Authorization: "Bearer " + idToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    } as RequestInit;
}