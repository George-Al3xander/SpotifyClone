import React from "react";



const DisplayPlaylist = ({playlist}) => {

    function getPlaylistLength() {
        let duration = playlist.tracks.reduce((prev,curr) => {
            return prev + curr.track.duration_ms

        }, 0);

        return duration
    }
    return(
        <div className="list">
            <div className="list-top">
                <div className="list-top-img">
                <img src={playlist.img} alt="" />    
                </div>  
                <div className="list-top-titles">
                    <h2>Playlist</h2>
                    <h1>{playlist.name}</h1>
                    {playlist.description != "" ? <h2 className="description">{playlist.description}</h2> : null}
                    <div className="list-top-main-info">
                        <h2><a href={playlist.owner.url.spotify}>{playlist.owner.display_name}</a></h2>
                        {playlist.followers > 0 ? <h2>{playlist.followers} likes</h2> : null}
                        <h2>{playlist.tracks.length} songs</h2>

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