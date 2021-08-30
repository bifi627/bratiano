import { ShoppingList, Sorter } from "common/src/Models/ShoppingListDefinitions";
import * as admin from "firebase-admin";
export const onStartup = async () =>
{
    await deleteAllAnonymousUsers();
    await deleteObsoleteSorterEntries();
    await removeDeletedUsersFromSharedLists();
}

async function deleteAllAnonymousUsers()
{
    const usersToDelete: string[] = [];
    const deleteAnonymousUsers = async ( nextPageToken: string | undefined ) =>
    {
        const { users, pageToken } = await admin.auth().listUsers( 1000, nextPageToken );

        users.forEach( user =>
        {
            if ( user.providerData.length === 0 )
            {
                usersToDelete.push( user.uid );
            }
        } );

        if ( pageToken !== undefined )
        {
            await deleteAnonymousUsers( pageToken );
        }
    };
    await deleteAnonymousUsers( undefined );
    const result = await admin.auth().deleteUsers( usersToDelete );
    console.log( { result } );
}

async function deleteObsoleteSorterEntries()
{
    const shoppingListsCollection = await admin.firestore().collection( "shopping-lists" ).get();

    const allShoppingLists: ShoppingList[] = [];
    shoppingListsCollection.forEach( doc =>
    {
        allShoppingLists.push( doc.data() as ShoppingList );
    } );

    const entriesToDelete: string[] = [];
    const sorterCollections = await admin.firestore().collection( "sorter" ).get();
    sorterCollections.forEach( doc =>
    {
        const sorter = doc.data() as Sorter;
        if ( allShoppingLists.findIndex( ( list, index ) => list.id === sorter.id ) === -1 )
        {
            entriesToDelete.push( sorter.id );
        }
    } );

    const batch = admin.firestore().batch();
    entriesToDelete.forEach( entry =>
    {
        batch.delete( admin.firestore().doc( `sorter/${entry}` ) );
    } );
    const result = await batch.commit();
    console.log( `Deleted ${result.length} obsolete entries from 'sorter'` );
}

async function removeDeletedUsersFromSharedLists()
{
    const allUsers: string[] = [];
    const getAllUsers = async ( nextPageToken: string | undefined ) =>
    {
        const { users, pageToken } = await admin.auth().listUsers( 1000, nextPageToken );

        allUsers.push( ...users.map( u => u.uid ) );

        if ( pageToken !== undefined )
        {
            await getAllUsers( pageToken );
        }
    };
    await getAllUsers( undefined );

    const batch = admin.firestore().batch();
    const shoppingListsCollection = await admin.firestore().collection( "shopping-lists" ).get();
    shoppingListsCollection.forEach( doc =>
    {
        const shoppingList = doc.data() as ShoppingList;
        const cleanedShared = shoppingList.shared.filter( share => allUsers.includes( share ) );
        const document = admin.firestore().doc( `shopping-lists/${doc.id}` );
        if ( shoppingList.shared.length !== cleanedShared.length )
        {
            console.log( `Deleted ${shoppingList.shared.length - cleanedShared.length} obsolete entries from 'shared-protection/shared' at '${shoppingList.title}'` );
            batch.update( document, { shared: cleanedShared } );
        }
    } );
    await batch.commit();
}