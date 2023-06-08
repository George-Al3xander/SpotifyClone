import React from "react";
import  SpotifyPlayer from "react-spotify-web-playback"
const Player = ({token, uri, clickStatus, setCurrentDevice}) => {
    return <SpotifyPlayer play={clickStatus} 
    //showSaveIcon={true} 
    token={token} magnifySliderOnHover={true} callback={({currentDeviceId}) => {
        setCurrentDevice(currentDeviceId)
    }}  uris={uri}/>
}


export default Player