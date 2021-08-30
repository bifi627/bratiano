import styled from "styled-components";

interface Props
{
    checked: boolean;
    onChecked: ( checked: boolean ) => void
}

const Box = styled.div`
    padding-left: 5px;
    padding-right: 5px;
`;

const CheckBox = styled.input`
`;

const ItemCheckBox = ( props: Props ) =>
{
    return (
        <Box onClick={() =>
        {
            props.onChecked?.( !props.checked );
        }}>
            <CheckBox type="checkbox" color="primary" checked={props.checked} onChange={e =>
            {
                props.onChecked?.( !props.checked );
            }} />
        </Box>
    );
}

export default ItemCheckBox;