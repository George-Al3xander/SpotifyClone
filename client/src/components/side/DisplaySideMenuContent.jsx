import React from "react";
import DisplaySideMenuItem from "./DisplaySideMenuItem";

const DisplaySideMenuContent = ({type, array,  functions, currentPlayUri, clickStatus}) => {
    let func;
    if(type == "playlist") {
        func = functions[0]
    }
    else if(type == "album") {
        func = functions[1]
    }
   
    return(
    <ul className="side-menu-content-results">
        {array.map((item) => {
            return <DisplaySideMenuItem 
                        func={func}
                        type={type} 
                        item={item}
                        currentPlayUri={currentPlayUri}
                        clickStatus={clickStatus}
                    />
        })}
        
    </ul>
    )
}


export default DisplaySideMenuContent