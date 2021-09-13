import bodyParser from "body-parser";
import { DocumentAccess } from "common/src/Contracts/DocumentAccess";
import { ShoppingLists } from "common/src/Contracts/ShoppingLists";
import cors from "cors";
import express from "express";
import * as admin from "firebase-admin";
import http from "http";
import io, { ServerOptions } from "socket.io";
import { firebaseAuthMiddleware } from "./middleware/firebaseAuthMiddleware";
import ConnectionManager from "./modules/connection";
import { onStartup } from "./modules/maintanence";
import { createSharedDocAccess, getSharedDocAccess } from "./modules/sharedDocumentAccessHandler";
import { shoppingListsDataProvider } from "./modules/shoppingListsHandler";

let firebaseAccount: admin.ServiceAccount;
if ( process.env.FIREBASE_ACCOUNT !== undefined && process.env.FIREBASE_ACCOUNT !== "" )
{
    firebaseAccount = JSON.parse( process.env.FIREBASE_ACCOUNT );
}
else
{
    firebaseAccount = require( "../firebaseAccount.json" );
}

const app = express();

admin.initializeApp( {
    credential: admin.credential.cert( firebaseAccount as any ),
    projectId: "bratiano-v1",
} );

const serverConfig: Partial<ServerOptions> = {
    cors: {
        origin: [ "http://localhost:3000", "http://192.168.0.106:3000", "https://bratiano-v1.web.app", "https://bratiano-v1.firebaseapp.com" ],
        methods: [ "GET", "POST" ],
    }
};

app.use( cors( { origin: serverConfig.cors?.origin } ) );
app.use( bodyParser.json() );

console.log( { cors: serverConfig.cors?.origin } );

const httpServer = new http.Server( app );
const ioServer = new io.Server( httpServer, serverConfig );

ioServer.use( firebaseAuthMiddleware );
const connectionManager = new ConnectionManager( ioServer );

onStartup().then( () =>
{
    console.log( "onStartUp maintanance finished..." );
} );

app.get( ShoppingLists.Endpoint, ShoppingLists.Server.createShoppingListRequestHandler( shoppingListsDataProvider ) );
app.get( DocumentAccess.Endpoint, DocumentAccess.Server.createDocumentAccessRequestedHandler( getSharedDocAccess ) );
app.post( DocumentAccess.Endpoint, DocumentAccess.Server.createDocumentAccessCreateHandler( createSharedDocAccess ) );

app.get( "/", ( req, res ) =>
{
    res.send( "OK" );
} );

const PORT = process.env.PORT || 5000;
console.log( { PORT } );
httpServer.listen( PORT );