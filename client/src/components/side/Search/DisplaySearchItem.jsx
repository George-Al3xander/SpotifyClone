import React from "react";

const DisplaySearchItem = ({item, type, func}) => {

    return(
        <div onClick={() => {
            func(item.id);
        }} className={"search-item"} >
            <div>
            {type == "artist" ? <img  style={{borderRadius: "50%", aspectRatio: "1 / 1"}}  src={item.img} alt="" /> : <img  src={item.img} alt="" />}
            </div> 
            <h1>{item.name}</h1>

            <h2>
            {type == "album" ? 
            
            item.owner.map((artist) => {
                return <>
                    <a href={artist.external_urls.spotify}>{artist.name}</a> {item.owner.indexOf(artist) != item.owner.length-1 ? ", " : null}
                    </>
                })             
                
            :

            <div>{item.owner}</div>
            
            }
            </h2>           
        </div>
    )
}

export default DisplaySearchItem