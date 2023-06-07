import React from "react";
import  SpotifyPlayer from "react-spotify-web-playback"
const Player = ({token, uri}) => {
    return <SpotifyPlayer token={token}  uris={uri}/>
}


export default Player