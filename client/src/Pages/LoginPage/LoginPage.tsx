import { Box } from "@material-ui/core";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";
import logo from "../../BRATIANO.svg";
import Login from "../../Components/Login/Login";
import { LoginViewModel } from "../../Components/Login/LoginViewModel";

interface LoginDialogProps
{
}

const FullScreen = styled.div`
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
`;

const Logo = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

export default observer( ( props: LoginDialogProps ) => 
{
    return (
        <FullScreen>
            <Box boxShadow={20} style={{ width: "90%" }}>
                <Logo alt="logo" src={logo}></Logo>
                <Login login={new LoginViewModel()}></Login>
            </Box>
        </FullScreen>
    );
} );