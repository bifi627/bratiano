import { Avatar, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, FormControlLabel, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, TextField, Theme, useTheme } from "@material-ui/core";
import { AccountCircle, Add, Delete, Share } from "@material-ui/icons";
import PublicIcon from '@material-ui/icons/Public';
import { DocumentAccess } from "common/src/Contracts/DocumentAccess";
import { ShoppingLists } from "common/src/Contracts/ShoppingLists";
import { ShoppingList as ShoppingListType, Sorter } from "common/src/Models/ShoppingListDefinitions";
import "firebase/database";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { v4 as uuidv4 } from "uuid";
import AuthContext from "../../AuthContext";
import UiStateContext from "../../UiStateContext";

const ShoppingListOverview = () =>
{
    const authContext = useContext( AuthContext );
    const userId = authContext.authProvider.currentUser?.uid;
    const userIsAnonymous = authContext.authProvider.currentUser?.isAnonymous
    const collection = authContext.storeProvider.collection( "shopping-lists" );
    const sortables = authContext.storeProvider.collection( "sorter" );


    const uid = authContext.authProvider.currentUser?.uid ?? "";

    const history = useHistory<ShoppingListType>();

    const theme = useTheme<Theme>();

    const uiState = useContext( UiStateContext );

    const [ idToken, setIdToken ] = useState( "" );

    const [ docs, setDocs ] = useState<ShoppingListType[]>( [] )
    const [ error, setError ] = useState<any>();

    const refresh = async () =>
    {
        if ( idToken !== "" )
        {
            try
            {
                uiState.isLoading = true;
                const response = await ShoppingLists.Client.getShoppingLists( idToken );
                response.lists.sort( ( left, right ) =>
                {
                    return ( left.createdAt as any )._seconds > ( right.createdAt as any )._seconds ? -1 : 1;
                } );
                setDocs( response.lists );
                setError( undefined );
            }
            catch ( error )
            {
                setError( error );
            }
            finally
            {
                uiState.isLoading = false;
            }
        }
    }

    useEffect( () =>
    {
        const func = () =>
        {
            refresh();
        }
        func();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ idToken, history ] );

    useEffect( () =>
    {
        const func = async () =>
        {
            const idToken = await authContext.authProvider.currentUser?.getIdToken() ?? "";
            setIdToken( idToken );
        };
        func();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ authContext.authProvider.currentUser ] );

    const createNewShoppingList = async () =>
    {
        const id = uuidv4();
        const title = newListName;
        const password = newListPassword;
        const data: ShoppingListType = {
            owner: uid,
            shared: [],
            title: title,
            createdAt: new Date(),
            description: "",
            id: id,
            protected: newListPrivate === false
        };
        const idToken = await authContext.authProvider.currentUser?.getIdToken() ?? "";
        await collection.doc( id ).set( data );
        await sortables.doc( id ).set( { id: id, order: [], owner: uid } as Sorter );
        if ( newListPrivate === false )
        {
            await DocumentAccess.Client.createDocumentAccess( { idToken: idToken, docPath: `/shopping-lists/${id}`, password: password } );
        }
        setNewListName( "" );
        setNewListPassword( "" );
        setNewListPrivate( true );
        setNewListDialogOpened( false );
        authContext.analyticsProvider.logEvent( "list_create" );
    };

    const showConfirmDeleteDialog = ( id: string ) =>
    {
        setItemToDelete( id );
    }

    const deleteItem = async ( id: string ) => 
    {
        const document = collection.doc( id );

        // Delete shared protection data
        const protectionData = await authContext.storeProvider.collection( "shared-protection" ).where( "document", "==", document ).limit( 1 ).get();
        if ( protectionData.empty === false )
        {
            const protectionId = protectionData.docs[ 0 ].id;
            const protectionDoc = authContext.storeProvider.collection( "shared-protection" ).doc( protectionId );
            await protectionDoc.delete();
        }

        // Delete sub collection
        const items = await document.collection( "items" ).get();
        await Promise.all( items.docs.map( d => d.ref.delete() ) );

        // Delete document
        await document.delete();
        await refresh();
        authContext.analyticsProvider.logEvent( "list_delete" );
        setItemToDelete( "" );
    }

    const addItem = async () =>
    {
        await createNewShoppingList();
        await refresh();
    }

    const openItem = async ( item: ShoppingListType ) =>
    {
        history.push( "list", item );
    }

    const [ isNewListDialogOpened, setNewListDialogOpened ] = React.useState( false );
    const [ itemToDelete, setItemToDelete ] = React.useState( "" );

    const [ newListName, setNewListName ] = React.useState( "" );
    const [ newListPassword, setNewListPassword ] = React.useState( "" );
    const [ newListPrivate, setNewListPrivate ] = React.useState( true );

    return (
        <>
            <Dialog onClose={() => setNewListDialogOpened( false )} open={isNewListDialogOpened}>
                <DialogTitle>Neue Liste</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Um eine neue Liste anzulegen, gib einen Titel ein und tippe auf 'Erstellen'.
                    </DialogContentText>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <TextField value={newListName} autoFocus label="Titel" onChange={e => setNewListName( e.target.value )}>
                        </TextField>
                        <FormControlLabel
                            style={{ marginTop: "20px" }}
                            control={
                                <Checkbox
                                    checked={newListPrivate}
                                    onChange={( e, c ) => setNewListPrivate( c )}
                                    name="checkedB"
                                    color="primary"
                                />
                            }
                            label="Privat"
                        />
                        {newListPrivate === false &&
                            <div>
                                {/* <p>Öffentliche Listen können von jedem der das Passwort kennt eingesehen und bearbeitet werden!</p> */}
                                <TextField value={newListPassword} type="password" label="Passwort" onChange={e => setNewListPassword( e.target.value )}>
                                </TextField>
                            </div>
                        }
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setNewListDialogOpened( false )}>
                        Abbrechen
                    </Button>
                    <Button onClick={addItem} color="primary">
                        Erstellen
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog onClose={() => setItemToDelete( "" )} open={itemToDelete !== ""}>
                <DialogTitle>Liste löschen</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Das Löschen einer Liste kann nicht rückgängig gemacht werden. Möchten Sie die Liste permanent löschen?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setItemToDelete( "" )}>
                        Abbrechen
                    </Button>
                    <Button onClick={() => deleteItem( itemToDelete )} color="primary">
                        Löschen
                    </Button>
                </DialogActions>
            </Dialog>
            <List>
                {docs.map( item =>
                {
                    return (
                        <ListItem key={item.id} onClick={() => openItem( item )}>
                            <ListItemAvatar >
                                <Avatar style={{ background: "white", borderStyle: "solid", borderColor: theme.palette.primary.main }}>
                                    {item.owner === userId ?
                                        <AccountCircle color="primary" /> :
                                        item.shared.find( s => s === authContext.authProvider.currentUser?.uid ) !== undefined ?
                                            <Share color="primary" /> :
                                            <PublicIcon color="primary" />}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={item.title} secondary={`von ${item.ownerName} erstellt. (${new Date( ( item.createdAt as any )._seconds * 1000 ).toLocaleString( "de-DE" )})`} />
                            <ListItemSecondaryAction>
                                {item.owner === authContext.authProvider.currentUser?.uid &&
                                    <IconButton edge="end" aria-label="delete" onClick={() => showConfirmDeleteDialog( item.id )}>
                                        <Delete />
                                    </IconButton>
                                }
                            </ListItemSecondaryAction>
                        </ListItem>
                    );
                } )}
            </List>
            {userIsAnonymous === false && <Fab style={{ position: "fixed", bottom: 50, right: 50 }} color="primary" aria-label="add" onClick={() => setNewListDialogOpened( true )}>
                <Add />
            </Fab>}
        </>
    )
};

export default ShoppingListOverview;