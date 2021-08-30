
export function createAuthHeader( idToken: string )
{
    return {
        headers: {
            Authorization: "Bearer " + idToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    } as RequestInit;
}