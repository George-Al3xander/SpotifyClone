import React from "react";

const DisplayShow = ({show}) => {
    return(
        <div className="list">
            <div className="list-top">
                <div className="list-top-img">
                <img src={show.img} alt="" />    
                </div>  
                <div className="list-top-titles">
                    <h2>Show</h2>
                    <h1>{show.name}</h1>                    
                    <div className="list-top-main-info">
                       <h2>{show.owner}</h2>    
                        
                    </div>
                </div>              
            </div>
        </div>
    )
}


export default DisplayShow