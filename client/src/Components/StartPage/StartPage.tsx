import loadable from "@loadable/component";
import { AppBar, Backdrop, CircularProgress, Drawer, IconButton, Menu, MenuItem, Toolbar, Typography } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { ShoppingItem } from "common/src/Models/ShoppingListDefinitions";
import { observer } from "mobx-react";
import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Route, Switch, useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import AuthContext from "../../AuthContext";
import ShoppingListPage from "../../Pages/ShoppingListPage/ShoppingListPage";
import { ShoppingListViewModel } from "../../Pages/ShoppingListPage/ShoppingListViewModel";
import UiStateContext from "../../UiStateContext";
import LeftMenu from "../LeftMenu/LeftMenu";
import { LeftMenuViewModel } from "../LeftMenu/LeftMenuViewModel";
import { StartPageViewModel } from "./StartPageViewModel";

const Profile = loadable( () => import( "../Profile/Profile" ) );
const ShoppingListOverview = loadable( () => import( "../ShoppingListOverview/ShoppingListOverview" ) );

interface StartPage
{
    viewModel: StartPageViewModel;
}

const Page = styled.div``;

const Header = styled.div``;

const Content = styled.div`
    position: fixed;
    top: 64px;
    bottom: 0px;
    left: 0;
    right: 0;
    overflow: auto;
`;

const ProfileMenuItem = ( props: { onClickHandler: () => void } ) =>
{
    const history = useHistory();
    return (
        <MenuItem onClick={() =>
        {
            props.onClickHandler();
            history.push( "/profile" );
        }
        }>Profil</MenuItem>
    );
}

const HeaderText = () =>
{
    const location = useLocation();
    const map: Map<string, string> = new Map();
    map.set( "/", "Alle Listen" );
    map.set( "/profile", "Profil" );
    map.set( "/list", "Liste" );

    const text = map.get( location.pathname ) ?? location.pathname;

    return <>{text}</>
}

export default observer( ( props: StartPage ) =>
{
    const authContext = useContext( AuthContext );

    const uiState = useContext( UiStateContext );

    const history = useHistory<ShoppingItem>();

    // const [ bottomNav, setBottomNav ] = useState( "recents" );
    const [ drawerOpened, setDrawerOpened ] = useState( false );

    const [ menuRoot, setMenuRoot ] = useState<SVGSVGElement | null>( null );

    return (
        <Page>
            {/* Loading */}
            <Backdrop style={{ zIndex: 999999 }} onClick={e =>
            {
                e.preventDefault();
                e.stopPropagation()
            }} open={uiState.isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Router>
                {/* Header */}
                <Header>
                    <AppBar position="fixed">
                        <Toolbar>
                            <IconButton edge="start" color="inherit" aria-label="menu">
                                <MenuIcon onClick={() => setDrawerOpened( x => !x )} />
                            </IconButton>
                            <Typography style={{ flexGrow: 1 }} variant="h6">
                                <HeaderText></HeaderText>
                            </Typography>
                            <IconButton edge="end" color="inherit" aria-label="menu">
                                <MoreVertIcon onClick={e => setMenuRoot( e.currentTarget )} color="inherit"></MoreVertIcon>
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <Toolbar />
                </Header>

                <Menu anchorEl={menuRoot} open={Boolean( menuRoot )} onClose={() => setMenuRoot( null )} >
                    <ProfileMenuItem onClickHandler={() => setMenuRoot( null )}></ProfileMenuItem>
                    <MenuItem onClick={async () => await authContext.logout()}>Ausloggen</MenuItem>
                </Menu>

                {/* Left Drawer */}
                <>
                    <Drawer anchor={"left"} open={drawerOpened} onClose={() => setDrawerOpened( false )}>
                        <div style={{ width: "250px" }}>
                            <LeftMenu viewModel={new LeftMenuViewModel( authContext, () => setDrawerOpened( false ) )}></LeftMenu>
                        </div>
                    </Drawer>
                </>

                {/* Content */}
                <Content>
                    <Switch>
                        <Route exact path="/">
                            <ShoppingListOverview></ShoppingListOverview>
                        </Route>
                        <Route path="/list">
                            <ShoppingListPage viewModel={new ShoppingListViewModel()}></ShoppingListPage>
                        </Route>
                        <Route path="/profile">
                            <Profile></Profile>
                        </Route>
                    </Switch>
                </Content>

                {/* Bottom Menu */}
                {/* <div style={{ borderTop: "solid 1px", borderColor: theme.palette.primary.main, position: "fixed", width: "100%", bottom: "0" }}>
                    <BottomNavigation showLabels value={bottomNav} onChange={( event, newValue ) => setBottomNav( newValue )}>
                        <BottomNavigationAction label="Test 1" value="recents" icon={<WebSharp />} />
                        <BottomNavigationAction label="Test 2" value="favorites" icon={<WebSharp />} />
                    </BottomNavigation>
                </div> */}
            </Router>
        </Page >
    );
} );
