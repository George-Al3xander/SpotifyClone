import React from "react";

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
            return <li key={item.id} 
                onDoubleClick={async () => {
                    await func(item.id);
                }} 
                onClick={async () => {
                    await func(item.id);
                }} 
                id={item.id}>
                {type == "artist" ? <img style={{borderRadius: "50%"}} src={item.img} alt="" /> : <img src={item.img} alt="" />}
                <div>
                    {(item.uri == currentPlayUri && clickStatus == true) ? 

                    <h2 style={{color: "green"}}>{item.name}</h2>
                    : 
                    
                    <h2>{item.name}</h2>
                    }
                    {type == "artist" ? <h3>{type}</h3> : <h3>{item.owner}</h3>}
                </div>
            </li>
        })}
        
    </ul>
    )
}


export default DisplaySideMenuContent