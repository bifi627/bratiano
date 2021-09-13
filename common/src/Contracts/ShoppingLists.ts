import { Request, Response } from "express";
import { getServer } from "..";
import { useBearerToken } from "../Hooks/serverHooks";
import { ShoppingList } from "../Models/ShoppingListDefinitions";
import { createAutherizedRequest } from "./Settings";

export namespace ShoppingLists
{
    export const Endpoint = "/v1/shopping_lists";

    export namespace Client
    {
        export async function getShoppingLists( idToken: string ): Promise<ShoppingListsResponse>
        {
            const response = await fetch( `${getServer()}${Endpoint}`, createAutherizedRequest( idToken ) );
            const data = await response.json() as ShoppingListsResponse;
            return data;
        }
    }

    export namespace Server
    {
        export function createShoppingListRequestHandler( getData: ( idToken: string ) => Promise<ShoppingListsResponse> )
        {
            const requestHandler = ( request: Request, response: Response ) =>
            {
                const handler = async () =>
                {
                    try
                    {
                        const { token } = useBearerToken( request.headers.authorization ?? "" );
                        const data = await getData( token );
                        response.send( data );
                    }
                    catch ( error )
                    {
                        response.status( 500 ).send( error );
                    }

                };
                handler();
            }
            return requestHandler;
        }
    }
    export interface ShoppingListsResponse
    {
        lists: ShoppingList[]
    }
}