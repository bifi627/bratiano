import { Backdrop, CircularProgress } from "@material-ui/core";
import { observer } from "mobx-react";
import { useContext, useEffect } from "react";
import { Route, Switch, useHistory } from "react-router";
import AppFrameContext from "../AppFrame";

// eslint-disable-next-line import/no-anonymous-default-export
export default observer( () =>
{
    const appContext = useContext( AppFrameContext );
    const knownPages = Array.from( appContext.knownPages.values() );

    const history = useHistory();

    useEffect( () =>
    {
        return history.listen( ( location, action ) =>
        {
            // TODO Abort loading promises???
            appContext.uiStateManager.isLoadingContentBlock = false;
            appContext.currentPath = location.pathname;
        } );
    }, [ appContext, appContext.uiStateManager, history ] );

    return (
        <>
            <Backdrop style={{ zIndex: 999999 }} onClick={e =>
            {
                e.preventDefault();
                e.stopPropagation()
            }} open={appContext.uiStateManager.isLoadingContentBlock}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Switch>
                {knownPages.map( page =>
                {
                    return (
                        <Route exact path={page.path}>
                            <page.component></page.component>
                        </Route>
                    );
                } )}
            </Switch>
        </>
    );
} );
