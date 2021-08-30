import { IconButton, TextField } from "@material-ui/core";
import { Delete, Image } from "@material-ui/icons";
import { ShoppingItem } from "common/src/Models/ShoppingListDefinitions";
import firebase from "firebase";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import AuthContext from "../../AuthContext";
import ItemCheckBox from "./ItemCheckBox";

interface Props
{
    item: ShoppingItem;
    collectionRef: firebase.firestore.CollectionReference;
}

const Box = styled.div`
    display: flex;
    gap: 5px;
    align-items: center;
    height: 32px;
    margin-left: 10px;
    margin-top: 5px;
    width: 100%;
`;

const ShoppingListItem = ( props: Props ) =>
{
    const authContext = useContext( AuthContext );

    useEffect( () =>
    {
        setTitle( props.item.title );
        setDone( props.item.done ?? false );
    }, [ props.item ] );

    const [ title, setTitle ] = useState<string>( props.item.title );
    const [ done, setDone ] = useState<boolean>( props.item.done ?? false );

    const [ focus, setFocus ] = useState( false );

    const syncData = async () =>
    {
        if ( props.item.title !== title )
        {
            if ( title === "" )
            {
                deleteItem();
                authContext.analyticsProvider.logEvent( "item_delete" );
            }
            else
            {
                await props.collectionRef.doc( props.item.id ).update( "title", title );
                authContext.analyticsProvider.logEvent( "item_edit" );
            }
        }
    }

    const deleteItem = async () =>
    {
        await props.collectionRef.doc( props.item.id ).delete();
        if ( props.item.type === "Image" )
        {
            await authContext.storageProvider.ref( props.item.data ).delete();
        }
    }

    return (
        <Box>
            <ItemCheckBox checked={done} onChecked={( checked ) =>
            {
                props.collectionRef.doc( props.item.id ).update( "done", checked );
            }}></ItemCheckBox>

            {props.item.type === "Image" && <IconButton onClick={async () =>
            {
                if ( props.item.data !== undefined )
                {
                    const url = await authContext.storageProvider.ref( props.item.data ).getDownloadURL();
                    window.open( url );
                }
            }} >
                <Image />
            </IconButton>}
            <TextField fullWidth defaultValue={props.item.title} onChange={e =>
            {
                setTitle( e.currentTarget.value );
            }} onBlur={() =>
            {
                syncData();
                setTimeout( () => setFocus( false ), 100 );
            }} onFocus={() =>
            {
                setFocus( true );
            }} type="text"></TextField>

            <IconButton style={{ visibility: focus === true ? "visible" : "hidden", marginTop: "8px" }} onClick={() =>
            {
                deleteItem();
            }} >
                <Delete />
            </IconButton>
        </Box >
    )
}

export default ShoppingListItem;