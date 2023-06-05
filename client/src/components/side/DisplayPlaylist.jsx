import React from "react";

//Track time display
// function millisToMinutesAndSeconds(millis) {
//     var minutes = Math.floor(millis / 60000);
//     var seconds = ((millis % 60000) / 1000).toFixed(0);
//     return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
//   }


const DisplayPlaylist = (props) => {
    let playlist = props.playlist;
    console.log(playlist.duration) 
    return(
        <div className="list">
            <div className="list-top">
                <div className="list-top-img">
                <img src={playlist.img} alt="" />    
                </div>  
                <div className="list-top-titles">
                    <h2>{playlist.isPublic ? "Public" : "Private"} Playlist</h2>
                    <h1>{playlist.name}</h1>
                    {playlist.description != "" ? <h2 className="description">{playlist.description}</h2> : null}
                    <div className="list-top-main-info">
                        <h2><a href={playlist.owner.urls.spotify}>{playlist.owner.display_name}</a></h2>
                        {playlist.followers > 0 ? <h2>{playlist.followers} likes</h2> : null}
                        <h2>{playlist.tracks.length} songs,</h2>
                        <h2><span>{playlist.duration}</span></h2>
                    </div>
                </div>              
            </div>

            <div className="list-btns">
            
            </div>

            <div className="list-middle">
                
            </div>       
        </div>
    )
}


export default DisplayPlaylist