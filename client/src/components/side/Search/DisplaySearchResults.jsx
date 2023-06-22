import React from "react";
import DisplaySearchItem from "./DisplaySearchItem";

const DisplaySearchResults = ({array, type, func}) => {
    return (
        <div style={{marginBlock: "5rem"}}>
            <h1 style={{textTransform: "capitalize", fontSize: "var(--fs-big)"}}>{type}</h1>
            <div className="search-results-category">
                {array.map((item) => {
                return <DisplaySearchItem func={func} type={type} item={item} />
                })}
            </div>
        </div>
    )
}

export default DisplaySearchResults