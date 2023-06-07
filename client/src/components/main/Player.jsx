import React from "react";
import  SpotifyPlayer from "react-spotify-web-playback"
const Player = ({token, uri, clickStatus}) => {
    return <SpotifyPlayer play={clickStatus} showSaveIcon={true} token={token} magnifySliderOnHover={true} uris={uri} callback={(state) => {
        console.log(state)
    }}/>
}


export default Player