import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { getServer, setServer } from "common/src/index";
import { configure, makeObservable, observable } from "mobx";
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AuthContext, { AuthViewModel } from "./AuthContext";
import './index.css';
import reportWebVitals from './reportWebVitals';
import UiStateContext, { UiStateViewModel } from "./UiStateContext";

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
const uiStateViewModel = new UiStateViewModel();
makeObservable( uiStateViewModel, { isLoading: observable } );

ReactDOM.render(
  // <React.StrictMode>
  <AuthContext.Provider value={authViewModel}>
    <UiStateContext.Provider value={uiStateViewModel}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </UiStateContext.Provider>
  </AuthContext.Provider>
  // </React.StrictMode>
  ,
  document.getElementById( 'root' )
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
