import React from "react";
import DisplayTracks from "./DisplayTracks";

const DisplayPlaylist = (props) => {
    let playlist = props.playlist;
    let token = props.token;    
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
                        {playlist.followers > 0 ? <h2> · {playlist.followers} likes</h2> : null}
                        <h2> · {playlist.tracks.length} songs,</h2>
                        <h2><span>{playlist.duration}</span></h2>
                    </div>
                </div>              
            </div>

            <div className="list-btns">      

            {(props.playStatus == true && props.currentPlayUri == playlist.uri) ? <svg style={{fill: "var(--clr-primary)"}} onClick={(e) => {
                e.preventDefault();
                props.setPlayStatus(false)
            }} xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M370-320h60v-320h-60v320Zm160 0h60v-320h-60v320ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Z"/></svg> 

            :  

            <svg onClick={() => {
                props.clickPlay(playlist.uri);
                props.setCurrentPlayUri(playlist.uri);
            }} xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="m383-310 267-170-267-170v340Zm97 230q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Z"/></svg>
            }      






            {/* Tree dots */}
            <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M207.858-432Q188-432 174-446.142q-14-14.141-14-34Q160-500 174.142-514q14.141-14 34-14Q228-528 242-513.858q14 14.141 14 34Q256-460 241.858-446q-14.141 14-34 14Zm272 0Q460-432 446-446.142q-14-14.141-14-34Q432-500 446.142-514q14.141-14 34-14Q500-528 514-513.858q14 14.141 14 34Q528-460 513.858-446q-14.141 14-34 14Zm272 0Q732-432 718-446.142q-14-14.141-14-34Q704-500 718.142-514q14.141-14 34-14Q772-528 786-513.858q14 14.141 14 34Q800-460 785.858-446q-14.141 14-34 14Z"/></svg>
            </div>

            <div className="list-middle">
                <DisplayTracks 
                        token={token} 
                        type={"playlist"} 
                        currentTrack={props.currentTrack} 
                        playlistUri={props.playlist.uri} 
                        clickTrack={(num) => {
                            props.clickPlay(playlist.uri);
                            props.setCurrentPlayUri(playlist.uri);
                            props.setOffset(num)
                        }}                         
                        array={playlist.tracks}
                        currentPlay={props.currentPlay}
                        setCurrentPlay={props.setCurrentPlay}
                        currentPlayUri={props.currentPlayUri}
                        />
            </div>       
        </div>
    )
}


export default DisplayPlaylist



//Getting index of the track then setting currentPlay to slice.playlist(index)