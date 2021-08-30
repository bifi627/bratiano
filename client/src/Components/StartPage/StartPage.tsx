import { Backdrop, CircularProgress } from "@material-ui/core";
import { observer } from "mobx-react";
import { useContext } from "react";
import styled from "styled-components";
import AppFrameContext from "../../AppFrame/AppFrame";
import Content from "../../AppFrame/Components/Content";
import ContextMenu from "../../AppFrame/Components/ContextMenu";
import Header from "../../AppFrame/Components/Header";
import LeftDrawer from "../../AppFrame/Components/LeftDrawer";
import { StartPageViewModel } from "./StartPageViewModel";

interface StartPage
{
    viewModel: StartPageViewModel;
}

const Page = styled.div``;

const ContentWrapper = styled.div`
    position: fixed;
    top: 64px;
    bottom: 0px;
    left: 0;
    right: 0;
    overflow: auto;
`;

export default observer( ( props: StartPage ) =>
{
    const appContext = useContext( AppFrameContext );

    return (
        <Page>
            {/* Loading */}
            <Backdrop style={{ zIndex: 999999 }} onClick={e =>
            {
                e.preventDefault();
                e.stopPropagation()
            }} open={appContext.uiStateManager.isLoadingFullBlock}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <Header></Header>

            <ContextMenu></ContextMenu>

            <LeftDrawer></LeftDrawer>

            <ContentWrapper>
                <Content></Content>
            </ContentWrapper>

            {/* Bottom Menu */}
            {/* <div style={{ borderTop: "solid 1px", borderColor: theme.palette.primary.main, position: "fixed", width: "100%", bottom: "0" }}>
                    <BottomNavigation showLabels value={bottomNav} onChange={( event, newValue ) => setBottomNav( newValue )}>
                        <BottomNavigationAction label="Test 1" value="recents" icon={<WebSharp />} />
                        <BottomNavigationAction label="Test 2" value="favorites" icon={<WebSharp />} />
                    </BottomNavigation>
                </div> */}
        </Page >
    );
} );
