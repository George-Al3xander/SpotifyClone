import React from "react";
import DisplaySearchItem from "./DisplaySearchItem";

const DisplaySearchResults = ({array, type}) => {

    return (
        <div>
            {array.map((item) => {
                return <DisplaySearchItem type={"album"} item={item} />
            })}
        </div>
    )
}

export default DisplaySearchResults