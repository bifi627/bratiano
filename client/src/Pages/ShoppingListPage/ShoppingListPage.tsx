import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import arrayMove from 'array-move';
import { DocumentAccess } from "common/src/Contracts/DocumentAccess";
import { ShoppingItem, Sorter } from "common/src/Models/ShoppingListDefinitions";
import React, { useContext, useRef } from "react";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useHistory } from "react-router";
import { SortableContainer, SortableElement, SortableHandle } from "react-sortable-hoc";
import styled from "styled-components";
import AuthContext from "../../AuthContext";
import PasswordPage from "../PasswordPage/PasswordPage";
import { PasswordPageViewModel } from "../PasswordPage/PasswordPageViewModel";
import NewItem from "./NewItem";
import ShoppingListItem from "./ShoppingListItem";
import { ShoppingListViewModel } from "./ShoppingListViewModel";

interface Props
{
    viewModel: ShoppingListViewModel;
}

const ShoppingListPage = ( props: Props ) =>
{
    const authContext = useContext( AuthContext );
    const history = useHistory<ShoppingItem>();
    const docId = history.location.state?.id;

    const collectionRef = authContext.storeProvider.collection( `/shopping-lists/${docId}/items` );
    const [ collectionData, , error ] = useCollectionData<ShoppingItem>( collectionRef.orderBy( "createdAt", "asc" ) );

    const sorterRef = authContext.storeProvider.collection( `/sorter` );
    const sorterData = useCollectionData<Sorter>( sorterRef.where( "id", "==", docId ) )[ 0 ]?.[ 0 ];

    props.viewModel.items = collectionData as ShoppingItem[];
    props.viewModel.order = sorterData?.order || [];

    const bottomRef = useRef<HTMLDivElement>( null );

    React.useEffect( () =>
    {
        const func = async () =>
        {
            if ( error?.code === "permission-denied" )
            {
                const idToken = await authContext.authProvider.currentUser?.getIdToken() ?? "";
                const data = { password: "", docPath: collectionRef.parent?.path ?? "", idToken: idToken };
                const { access } = await DocumentAccess.Client.getDocumentAccess( data );
                if ( access === true )
                {
                    history.push( "/temp" );
                    history.goBack();
                }
            }
        }
        func();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ error?.code ] );

    const [ i, setI ] = React.useState( collectionData as ShoppingItem[] );
    React.useEffect( () =>
    {
        setI( props.viewModel.todoItems );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ collectionData, sorterData ] )

    if ( error !== undefined )
    {
        if ( error.code === "permission-denied" )
        {
            return <PasswordPage viewModel={new PasswordPageViewModel( authContext, collectionRef.parent?.path ?? "" )}></PasswordPage>
        }
    }

    const addItem = async ( newItem: ShoppingItem ) =>
    {
        await collectionRef.doc( newItem.id ).set( newItem );
        bottomRef.current?.scrollIntoView( { behavior: "smooth" } );
    }

    const onSortEnd = async ( { oldIndex, newIndex }: { oldIndex: number, newIndex: number } ) =>
    {
        if ( sorterData !== undefined )
        {
            const order = arrayMove( props.viewModel.todoItems.map( item => item.id ), oldIndex, newIndex );
            props.viewModel.order = order;
            setI( props.viewModel.todoItems );
            await sorterRef.doc( docId ).update( "order", order );
        }
        else
        {
            const initOrder = props.viewModel.todoItems.map( item => item.id );
            await sorterRef.doc( docId ).set( { id: docId, order: initOrder } as Sorter );
        }
    }

    return (
        <>
            <SortableList lockAxis="y" pressDelay={100} onSortEnd={onSortEnd} items={i} viewModel={props.viewModel}></SortableList>
            <NewItem addItem={addItem}></NewItem>
            {props.viewModel.doneItems?.map( ( item ) =>
            {
                return (
                    <ShoppingListItem key={item.id} item={item} collectionRef={collectionRef}></ShoppingListItem>
                );
            } )}
        </>
    );
}
const DragHandle = SortableHandle( () => <DragIndicatorIcon fontSize="small" style={{ width: "32px", paddingTop: "4px" }}></DragIndicatorIcon> );

const SortableList = SortableContainer( ( { items, viewModel }: { items: ShoppingItem[], viewModel: ShoppingListViewModel; } ) =>
{
    return (
        <ul style={{ paddingLeft: "10px" }}>
            {items?.map( ( value, index ) => (
                <>
                    <SortableItem key={value.id} index={index} value={value} viewModel={viewModel} />
                </>
            ) )}
        </ul>
    );
} );

const SortableDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: center;
    align-items: center;
`;

const SortableItem = SortableElement( ( { value, viewModel }: { value: ShoppingItem, viewModel: ShoppingListViewModel; } ) =>
{
    const authContext = useContext( AuthContext );
    const history = useHistory<ShoppingItem>();
    const docId = history.location.state?.id;
    const collectionRef = authContext.storeProvider.collection( `/shopping-lists/${docId}/items` );

    return (
        <SortableDiv key={value.id} style={{ display: "flex", flexDirection: "row" }}>
            <DragHandle></DragHandle>
            <ShoppingListItem item={value} collectionRef={collectionRef}></ShoppingListItem>
        </SortableDiv>
    );
} );

export default ShoppingListPage;
