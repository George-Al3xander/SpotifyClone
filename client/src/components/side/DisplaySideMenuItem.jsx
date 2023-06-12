import React from "react";


const DisplaySideMenuItem = ({type, item}) => {
    return <li id={item.id}>
                {type == "artist" ? <img style={{maxWidth: "32px", borderRadius: "50%"}} src={item.img} alt="" /> : <img style={{maxWidth: "32px"}} src={item.img} alt="" />}
                <div>
                    <h1>{item.name}</h1>
                    {type == "artist" ? <h2>{type}</h2> : <h2>{type} · {item.owner}</h2>}
                </div>
            </li>
}

export default DisplaySideMenuItem