import { ShoppingLists } from "common/src/Contracts/ShoppingLists";
import { ShoppingList } from "common/src/Models/ShoppingListDefinitions";
import * as admin from "firebase-admin";
import { useIdToken } from "../hooks/socketHooks";

export const shoppingListsDataProvider = async ( idToken: string ) =>
{
    const firebaseToken = await useIdToken( idToken );
    const uid = firebaseToken.uid;
    const collection = admin.firestore().collection( "shopping-lists" );
    const queryOwner = collection.where( "owner", "==", uid );
    const resultOwner = await queryOwner.get();
    const data = resultOwner.docs.map( doc => doc.data() as ShoppingList );

    const queryShared = collection.where( "shared", "array-contains", uid );
    const resultShared = await queryShared.get();
    const dataShared = resultShared.docs.map( doc => doc.data() as ShoppingList );

    const queryProtected = collection.where( "protected", "==", true );
    const resultProtected = await queryProtected.get();
    const dataProtected = resultProtected.docs.map( doc => doc.data() as ShoppingList );

    const allLists = [ ...data, ...dataShared.filter( s => s.owner !== uid ), ...dataProtected.filter( s => s.owner !== uid && s.shared.find( u => u === uid ) === undefined ) ]

    const uniqueUserIds: { uid: string }[] = [];

    allLists.forEach( list =>
    {
        if ( uniqueUserIds.find( o => uid === list.owner ) === undefined )
        {
            uniqueUserIds.push( { uid: list.owner } );
        }
    } );

    const userResponse = await admin.auth().getUsers( uniqueUserIds );

    allLists.forEach( list =>
    {
        list.ownerName = userResponse.users.find( user => user.uid === list.owner )?.displayName ?? "";
    } );

    const responseData: ShoppingLists.ShoppingListsResponse = {
        lists: allLists
    };
    return responseData;
}
