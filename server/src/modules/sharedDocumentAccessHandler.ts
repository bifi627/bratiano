import { DocumentAccess } from "common/src/Contracts/DocumentAccess";
import crypto from "crypto";
import * as admin from "firebase-admin";
import { useIdToken } from "../hooks/socketHooks";

export const getSharedDocAccess = async ( request: DocumentAccess.DocumentAccessRequest ): Promise<DocumentAccess.DocumentAccessResponse> =>
{
    const idToken = request.idToken;
    const docPath = request.docPath;
    const password = request.password;
    const path = request.docPath.split( "/" );
    const docId = path[ path.length - 1 ];

    const firebaseToken = await useIdToken( idToken );
    const passwordHash = crypto.createHash( "sha256" ).update( password, "utf8" ).digest( "hex" );

    const collection = admin.firestore().collection( "shared-protection" );
    const docRef = admin.firestore().doc( request.docPath );
    const queryDoc = collection.where( "document", "==", docRef ).where( "password", "==", passwordHash );
    const docResult = await queryDoc.get();
    if ( docResult.size === 1 )
    {
        const docContent = await admin.firestore().doc( docPath ).get();
        const shared = docContent.get( "shared" ) as string[];

        if ( shared.find( s => s === firebaseToken.uid ) === undefined )
        {
            await admin.firestore().doc( docPath ).update( "shared", [ ...shared, firebaseToken.uid ] );
        }
        return { access: true };
    }
    return { access: false };
};

export const createSharedDocAccess = async ( request: DocumentAccess.DocumentAccessRequest ): Promise<DocumentAccess.DocumentAccessResponse> =>
{
    const idToken = request.idToken;
    const password = request.password;
    const path = request.docPath.split( "/" );
    const docId = path[ path.length - 1 ];

    await useIdToken( idToken );
    const passwordHash = crypto.createHash( "sha256" ).update( password, "utf8" ).digest( "hex" );

    const collection = admin.firestore().collection( "shared-protection" );
    const docRef = admin.firestore().doc( request.docPath );
    const queryDoc = collection.where( "document", "==", docRef );
    const quedyData = await queryDoc.get();
    if ( quedyData.size === 0 )
    {
        const doc = admin.firestore().doc( request.docPath );
        await collection.doc().create( { document: doc, password: passwordHash } );
        return { access: true };
    }
    return { access: false };
}