import React, { useEffect, useState } from "react";

const Header = ({user, logout}) => {
    const [menuShown , setMenuShown] = useState(false);
    const [style, setStyle] = useState("hidden")
    useEffect(() => {
        if(menuShown == false) {
            setStyle("none")
        }
        else if(menuShown == true){
            setStyle("flex")
        }
    }, [menuShown])
    return(
        <div className="header">
            <div onClick={() => {
                setMenuShown((prev) => !prev);
            }} className="header-btn">
                <img src={user.img} alt="" />
            </div>
            <ul style={{display: style, flexDirection: "column"}}>
                <li onClick={() => {
                   window.open(user.link) 
                }}>Account <svg xmlns="http://www.w3.org/2000/svg" height="15" viewBox="0 -960 960 960" width="15"><path d="M186.666-120q-27 0-46.833-19.833T120-186.666v-586.668q0-27 19.833-46.833T186.666-840H466v66.666H186.666v586.668h586.668V-466H840v279.334q0 27-19.833 46.833T773.334-120H186.666ZM384-336.667 337.333-384l389.334-389.334H532.666V-840H840v307.334h-66.666v-193.335L384-336.667Z"/></svg></li>
                <li onClick={logout}>Logout</li>
            </ul>
        </div>
    )    
}


export default Header 