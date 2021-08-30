import React from "react";

export class UiStateViewModel
{
    public isLoading = false;
}

const UiStateContext = React.createContext<UiStateViewModel>( {} as UiStateViewModel );

export default UiStateContext;