import { Button, Tab, Tabs, TextField, Theme, useTheme } from "@material-ui/core";
import { observer } from "mobx-react";
import React, { useContext, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import AuthContext from "../../AuthContext";
import { LoginViewModel } from "./LoginViewModel";

const FlexBox = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    margin: 10px;
`;

interface Login
{
    login: LoginViewModel;
}

export default observer( ( props: Login ) =>
{
    const authContext = useContext( AuthContext );
    const login = props.login;
    const theme = useTheme<Theme>();

    const history = useHistory();
    const location = useLocation<any>();
    const { from } = location.state || { from: { pathname: "/" } };

    const [ errorMessage, setErrorMessage ] = useState( "" );

    const onClickLogin = async () => 
    {
        const response = await login.login( authContext, login.email, login.password );
        setErrorMessage( response !== true ? response.message : "" );
        if ( response === true )
        {
            history.replace( from );
        }
    }

    const onClickRegister = async () =>
    {
        const response = await login.register( authContext, login.email, login.password, login.username );
        setErrorMessage( response !== true ? response.message : "" );
        if ( response === true )
        {
            history.replace( from );
        }
    }

    const [ selectedTab, setSelectedTab ] = useState<"Login" | "Register">( "Login" );

    const onTabChange = ( _: any, value: "Login" | "Register" ) =>
    {
        setSelectedTab( value );
        login.clear();
        setErrorMessage( "" );
    }

    return (
        <>
            <Tabs textColor="primary" variant="fullWidth" value={selectedTab} onChange={onTabChange}>
                <Tab value="Login" label="Einloggen" />
                <Tab value="Register" label="Registrieren" />
            </Tabs>
            <FlexBox style={{ background: theme.palette.background.default }} >
                {selectedTab === "Login" &&
                    <>
                        <TextField error={errorMessage !== ""} value={login.email} onChange={e => login.email = e.target.value} required id="standard-email-input" label="E-Mail" type="email" />
                        <TextField error={errorMessage !== ""} value={login.password} onChange={e => login.password = e.target.value} required id="standard-password-input" label="Password" type="password" />
                        {errorMessage !== "" && <p style={{ color: theme.palette.error.main }}>{errorMessage}</p>}
                        <Button disabled={login.canTryLogin === false} variant="contained" color="primary" onClick={onClickLogin}>Einloggen</Button>
                    </>
                }
                {selectedTab === "Register" &&
                    <>
                        <TextField error={errorMessage !== ""} value={login.username} onChange={e => { login.username = e.target.value }} required id="standard-email-input" label="Benutzername" type="email" />
                        <TextField error={errorMessage !== ""} value={login.email} onChange={e => { login.email = e.target.value }} required id="standard-email-input" label="E-Mail" type="email" />
                        <TextField error={errorMessage !== ""} value={login.password} onChange={e => login.password = e.target.value} required id="standard-password-input" label="Password" type="password" />
                        {errorMessage !== "" && <p style={{ color: theme.palette.error.main }}>{errorMessage}</p>}
                        <Button disabled={login.canTryRegister === false} variant="contained" color="primary" onClick={onClickRegister}>Registrieren und Einloggen</Button>
                    </>
                }
                <Button variant="contained" color="primary" onClick={async () =>
                {
                    const response = await login.loginAnonymously( authContext );
                    setErrorMessage( response !== true ? response.message : "" );
                }}>Ohne Account</Button>
            </FlexBox >
        </>
    );
} );
