import { ShoppingList } from "../Models/ShoppingListDefinitions";
import { RequestHandler, Request, Response, request } from "express"
import { useBearerToken } from "../Hooks/serverHooks";
import { createAuthHeader as createAutherizedRequest } from "./Settings";
import { getServer } from "..";

export namespace DocumentAccess
{
    export const Endpoint = "/v1/document_access";

    export namespace Client
    {
        export async function getDocumentAccess( docAccessRequest: DocumentAccessRequest ): Promise<DocumentAccessResponse>
        {
            const request = createAutherizedRequest( docAccessRequest.idToken );
            request.method = "GET";
            const headers = request.headers as any;
            headers[ "docpath" ] = docAccessRequest.docPath;
            headers[ "password" ] = docAccessRequest.password;
            const response = await fetch( `${getServer()}${Endpoint}`, request );
            const data = await response.json() as DocumentAccessResponse;
            return data;
        }
        export async function createDocumentAccess( docAccessRequest: DocumentAccessRequest ): Promise<DocumentAccessResponse>
        {
            const request = createAutherizedRequest( docAccessRequest.idToken );
            request.method = "POST";
            request.body = JSON.stringify( docAccessRequest );
            const response = await fetch( `${getServer()}${Endpoint}`, request );
            const data = await response.json() as DocumentAccessResponse;
            return data;
        }
    }

    export namespace Server
    {
        export function createDocumentAccessRequestedHandler( getData: ( req: DocumentAccessRequest ) => Promise<DocumentAccessResponse> )
        {
            const requestHandler = ( request: Request, response: Response ) =>
            {
                const handler = async () =>
                {
                    try
                    {
                        const { token } = useBearerToken( request.headers.authorization ?? "" );
                        const requestData: DocumentAccessRequest = {
                            docPath: request.headers[ "docpath" ] as string ?? "",
                            password: request.headers[ "password" ] as string ?? "",
                            idToken: token
                        };

                        const data = await getData( requestData );
                        response.send( data );
                    }
                    catch ( error )
                    {
                        console.error( error );
                        response.status( 500 ).send( error );
                    }

                };
                handler();
            }
            return requestHandler;
        }
        export function createDocumentAccessCreateHandler( getData: ( req: DocumentAccessRequest ) => Promise<DocumentAccessResponse> )
        {
            const requestHandler = ( request: Request, response: Response ) =>
            {
                const handler = async () =>
                {
                    try
                    {
                        const { token } = useBearerToken( request.headers.authorization ?? "" );
                        const requestData = request.body as DocumentAccessRequest;
                        requestData.idToken = token;
                        const data = await getData( requestData );
                        response.send( data );
                    }
                    catch ( error )
                    {
                        console.error( error );
                        response.status( 500 ).send( error );
                    }

                };
                handler();
            }
            return requestHandler;
        }
    }
    export interface DocumentAccessRequest
    {
        idToken: string;
        docPath: string;
        password: string;
    }
    export interface DocumentAccessResponse
    {
        access: boolean;
    }
}