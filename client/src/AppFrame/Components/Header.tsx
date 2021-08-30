import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
import { Menu, MoreVert } from '@material-ui/icons';
import { useContext, useEffect, useRef } from "react";
import { useLocation } from "react-router";
import AppFrameContext from "../AppFrame";

// eslint-disable-next-line import/no-anonymous-default-export
export default () =>
{
    const appContext = useContext( AppFrameContext );

    const location = useLocation();

    const text = appContext.getHeaderTextForLocation( location );

    const contextMenuHandle = useRef<HTMLButtonElement | null>( null );

    const appFrame = useContext( AppFrameContext );
    const contextMenuItems = appFrame.getContextMenuForLocation( location );

    useEffect( () =>
    {
        if ( contextMenuHandle.current )
        {
            appContext.contextMenuHandle = contextMenuHandle.current;
        }
    }, [ appContext ] );

    return (
        <AppBar position="fixed">
            <Toolbar>
                {appFrame.mainMenu.length > 0 && <IconButton onClick={() => appContext.toggleDrawer()} edge="start" color="inherit" aria-label="menu">
                    <Menu />
                </IconButton>}
                <Typography style={{ flexGrow: 1 }} variant="h6">
                    {text}
                </Typography>
                {contextMenuItems && contextMenuItems.length > 0 && <IconButton ref={contextMenuHandle} onClick={() => appContext.toggleContextMenu()} edge="end" color="inherit" aria-label="menu">
                    <MoreVert color="inherit"></MoreVert>
                </IconButton>}
            </Toolbar>
        </AppBar>
    );
}
