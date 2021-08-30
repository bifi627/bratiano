import { TextField } from "@material-ui/core";
import React, { useContext } from "react";
import AuthContext from "../../AuthContext";

const Text = () =>
{
    const [ text, setText ] = React.useState( "" );
    return <TextField onKeyDown={( e ) =>
    {
        if ( e.key === "Enter" && text !== "" )
        {
            alert( text );
            setText( "" );
        }
    }} type="text" value={text} onChange={( e ) => setText( e.currentTarget.value )}></TextField>;
}

const Profile = () =>
{
    const authViewModel = useContext( AuthContext );

    const addItem = ( s: string ) =>
    {
        return Promise.resolve();
    }

    return (
        <div>
            {authViewModel.user.displayName}


        </div>
    );
}

export default Profile;