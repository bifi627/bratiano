import loadable from "@loadable/component";
import { Theme, useTheme } from "@material-ui/core";
import "firebase/auth";
import "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BrowserRouter, Redirect, Route, Switch, useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import './App.css';
import AuthContext from "./AuthContext";
import { StartPageViewModel } from "./Components/StartPage/StartPageViewModel";
import LoginPage from "./Pages/LoginPage/LoginPage";

const StartPage = loadable( () => import( "./Components/StartPage/StartPage" ) );

const Background = styled.div`
  height: 100vh;
`;

interface Props
{
}

function App( props: Props ) 
{
    const authContext = useContext( AuthContext );
    const theme = useTheme<Theme>();

    const history = useHistory();

    return (
        <BrowserRouter>
            <Background style={{ backgroundColor: theme.palette.background.paper }} className="App">
                <Switch>
                    <Route path="/login">
                        <PublicRoute>
                            <LoginPage></LoginPage>
                        </PublicRoute>
                    </Route>
                    <Route path="/">
                        <PrivateRoute>
                            <StartPage viewModel={new StartPageViewModel( authContext, history )}></StartPage>
                        </PrivateRoute>
                    </Route>
                </Switch>
            </Background >
        </BrowserRouter>
    );
}


interface RouteProps
{
    children: React.ReactNode
}

const PrivateRoute = ( props: RouteProps ) =>
{
    const authContext = useContext( AuthContext );
    const [ user ] = useAuthState( authContext.authProvider );
    const [ render, setRender ] = useState( false );

    useEffect( () =>
    {
        setTimeout( () =>
        {
            setRender( true );
        }, 1000 );
    } );

    return (
        <>
            {( render || user ) && <Route
                render={( { location } ) =>
                    user ? (
                        props.children
                    ) : (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: { from: location }
                            }}
                        />
                    )
                }
            />}
        </>
    );
}

const PublicRoute = ( props: RouteProps ) => 
{
    const authContext = useContext( AuthContext );
    const location = useLocation<any>();
    const state = location.state || { from: { pathname: "/" } };
    console.log( { state } );
    const [ user ] = useAuthState( authContext.authProvider );
    return (
        <Route
            render={( { location } ) =>
                !user ? (
                    props.children
                ) : (
                    <Redirect
                        to={{
                            pathname: state.from.pathname
                        }}
                    />
                )
            }
        />
    );
}

export default App;
