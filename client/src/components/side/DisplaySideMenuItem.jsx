import React, { useRef } from "react";


const DisplaySideMenuItem = ({type, item, currentPlayUri, clickStatus,func}) => {

    const itemLi = useRef();
    
    return <li  key={item.id} 
                ref={itemLi}
                onDoubleClick={async () => {
                    await func(item.id);
                }} 
                onClick={async () => {
                    await func(item.id);
                }} 
                id={item.id}>
                {type == "artist" ? <img  style={{borderRadius: "50%", aspectRatio: "1 / 1"}}  src={item.img} alt="" /> : <img  src={item.img} alt="" />}
                <div>
                    {(item.uri == currentPlayUri && clickStatus == true) ? 

                    <h2 style={{color: "green"}}>{item.name}</h2>
                    : 
                    
                    <h2>{item.name}</h2>
                    }
                    {type == "artist" ? null : <h3>{item.owner}</h3>}
                </div>
            </li>
}

export default DisplaySideMenuItem