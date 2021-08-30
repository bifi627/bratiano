import { Button, TextField } from "@material-ui/core";
import { observer } from "mobx-react";
import React from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import { PasswordPageViewModel } from "./PasswordPageViewModel";

interface PasswordPage
{
    viewModel: PasswordPageViewModel;
}

const FlexBox = styled.div`
    display: flex;
    flex-direction: column;
    margin: 20px;
`;

export default observer( ( props: PasswordPage ) =>
{
    const history = useHistory();

    const [ error, setError ] = React.useState( "" );

    return (
        <FlexBox>
            <TextField error={error !== "" && props.viewModel.password !== ""} helperText={error !== "" && props.viewModel.password !== "" ? error : "Passwort eingeben"} autoFocus value={props.viewModel.password} variant="outlined" type="password" label="Passwort" onChange={e =>
            {
                props.viewModel.password = e.target.value;
                setError( "" );
            }}></TextField>
            <Button style={{ marginTop: "20px" }} variant="contained" color="primary" onClick={async () =>
            {
                const access = await props.viewModel.getAccess();
                if ( access === true )
                {
                    history.push( "/temp" );
                    history.goBack();
                }
                else
                {
                    setError( "Falsches Passwort" );
                }
            }} >Weiter</Button>
        </FlexBox>
    );
} );