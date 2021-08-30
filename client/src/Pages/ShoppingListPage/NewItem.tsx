import { IconButton, TextField } from "@material-ui/core";
import { Add, CameraAlt } from "@material-ui/icons";
import imageCompression from "browser-image-compression";
import { ShoppingItem } from "common/src/Models/ShoppingListDefinitions";
import React, { useContext } from "react";
import styled from "styled-components";
import { v4 } from "uuid";
import AuthContext from "../../AuthContext";
import UiStateContext from "../../UiStateContext";

const Box = styled.div`
    display: flex;
    margin-left: 75px;
    height: 32px;
    margin-top: 20px;
    margin-bottom: 20px;
`;

const ItemNew = ( props: { addItem: ( item: ShoppingItem ) => Promise<void> } ) =>
{
    const authContext = useContext( AuthContext );

    const openPhotoPicker = async () =>
    {
        clearTimeout( blurTimeout );
        if ( imgRef.current && textRef.current && currentText !== "" )
        {
            imgRef.current.click();
        }
    }

    const uiState = useContext( UiStateContext );

    const onFileChanged = async () =>
    {
        try
        {
            uiState.isLoading = true;
            if ( imgRef.current && imgRef.current.files?.length === 1 )
            {
                const myFile = imgRef.current.files[ 0 ];
                if ( myFile.size > 10485760 )
                {
                    alert( 'Image is too big (max. 10 Mb)' );
                    return;
                }

                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true
                }
                const compressedFile = await imageCompression( myFile, options );

                const uuid = v4();

                const storagePathAndFilename = "/ListPhotos/" + uuid;
                const ref = authContext.storageProvider.ref( storagePathAndFilename )
                const info = await ref.put( compressedFile );
                await addImage( uuid, currentText, info.ref.fullPath );
            }
        }
        finally
        {
            uiState.isLoading = false;
        }
    }

    const addImage = async ( id: string, text: string, data: string ) =>
    {
        const newItem: ShoppingItem = {
            id: id,
            title: text,
            createdAt: new Date(),
            done: false,
            type: "Image",
            data: data,
        };
        await props.addItem( newItem );
    }

    const addText = async ( text: string ) =>
    {
        const id = v4();

        const newItem: ShoppingItem = {
            id: id,
            title: text,
            createdAt: new Date(),
            done: false,
            type: "Text",
        };
        await props.addItem( newItem );
    }

    const [ blurTimeout, setBlurTimeout ] = React.useState( 0 );

    const imgRef = React.useRef<HTMLInputElement>( null );
    const textRef = React.useRef<HTMLInputElement>( null );

    const [ currentText, setCurrentText ] = React.useState( "" );

    return (
        <Box>
            <TextField ref={textRef} fullWidth onBlur={e =>
            {
                const b = setTimeout( async () =>
                {
                    const title = e.target.value;
                    if ( title !== "" )
                    {
                        e.target.value = "";
                        await addText( title );
                    }
                }, 100 );
                setTimeout( () =>
                {
                    e.target.value = "";
                }, 200 );
                setBlurTimeout( b as unknown as number );
            }} onKeyDown={async e =>
            {
                if ( e.key === "Enter" )
                {
                    const title = ( e.target as any ).value;
                    ( e.target as any ).value = "";
                    await addText( title );
                }
                setTimeout( () =>
                {
                    setCurrentText( ( e.target as any ).value );
                }, 100 );
            }} type="text"></TextField>
            <IconButton style={{ marginTop: "8px" }}>
                <Add />
            </IconButton>
            <IconButton onClick={openPhotoPicker} style={{ marginTop: "8px" }}>
                <CameraAlt />
            </IconButton>
            <input ref={imgRef} onChange={onFileChanged} style={{ position: "absolute", top: "-999px", left: "-999px" }} type="file" accept="image/x-png,image/jpeg,image/gif" />
        </Box>
    );
}

export default ItemNew;