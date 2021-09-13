import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import AppFrameContext, { AppFrame, ContextMenuAction, ContextMenuNavigation } from "@pwa-frame/core/dist/AppFrame";
import DemoPage from "@pwa-frame/core/dist/Pages/DemoPage";
import { getServer, setServer } from "common/src/index";
import { configure } from "mobx";
import ReactDOM from 'react-dom';
import App from './App';
import AuthContext, { AuthViewModel } from "./AuthContext";
import Profile from "./Components/Profile/Profile";
import ShoppingListOverview from "./Components/ShoppingListOverview/ShoppingListOverview";
import './index.css';
import ShoppingListPage from "./Pages/ShoppingListPage/ShoppingListPage";
import { ShoppingListViewModel } from "./Pages/ShoppingListPage/ShoppingListViewModel";
import reportWebVitals from './reportWebVitals';

configure( { enforceActions: "never" } )

const theme = createMuiTheme( {
    palette: {
        primary: {
            main: '#607f31'
        },
        secondary: {
            main: '#66bde8'
        },
    },
} );

const server = process.env[ "REACT_APP_SERVER" ];

if ( server !== undefined && server !== "" )
{
    setServer( server );

    // Wake up server ;-)
    fetch( getServer() ).then( response => console.log( response ) ).catch( error => console.error( error ) );
}
else 
{
    alert( "REACT_APP_SERVER is not defined!" );
}

const authViewModel = new AuthViewModel();
const appViewModel = new AppFrame();

const contextActionLogout = new ContextMenuAction( "Ausloggen", () =>
{
    return authViewModel.logout();
} );

appViewModel.registerPage( {
    path: "/",
    title: "Alle Listen",
    contextMenuItems: [
        new ContextMenuNavigation( "Profil", "/profile" ),
        contextActionLogout
    ],
    component: () =>
    {
        return <ShoppingListOverview></ShoppingListOverview>
    },
} );
appViewModel.registerPage( {
    path: "/profile",
    title: "Profil",
    contextMenuItems: [
        contextActionLogout
    ],
    component: () =>
    {
        return <Profile></Profile>;
    },
} );
const shoppingListViewModel = new ShoppingListViewModel();
const shoppingListPage = {
    path: "/list",
    title: "Liste",
    contextMenuItems: [
        // new ContextMenuAction( "OK", () =>
        // {
        //     shoppingListViewModel.test();
        //     return Promise.resolve();
        // } ),
        contextActionLogout,
    ],
    component: () =>
    {
        return <ShoppingListPage viewModel={shoppingListViewModel}></ShoppingListPage>;
    },
};
appViewModel.registerPage( shoppingListPage );

appViewModel.registerPage( {
    path: "/demo",
    title: "Demo-Seite",
    contextMenuItems: [],
    component: () =>
    {
        return <DemoPage></DemoPage>
    }
} );

appViewModel.defaultPath = "/demo";
appViewModel.mainMenu = [ "/", "/profile" ];

export const getAuthContext = () => 
{
    return authViewModel;
}

ReactDOM.render(
    // <React.StrictMode>
    <AuthContext.Provider value={authViewModel}>
        <AppFrameContext.Provider value={appViewModel}>
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </AppFrameContext.Provider>
    </AuthContext.Provider>
    // </React.StrictMode>
    ,
    document.getElementById( 'root' )
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
