import React, { useRef } from "react";
import  SpotifyPlayer from "react-spotify-web-playback"
import ShuffleBtn from "../side/ShuffleBtn";
import RepeatBtn from "../side/RepeatBtn";
const Player = ({token, uri, clickStatus, setCurrentDevice, shuffle, shuffleStatus, repeatStatus, repeat, setRepeatStatus, setCurrentTrack,setClickStatus, offset}) => {
  const repeatTypes = ['off', 'context' , 'track' ] 
  const item = useRef();  
    return <SpotifyPlayer 
    showSaveIcon={true}
    ref={item} 
    play={clickStatus}     
    hideAttribution={true}
    token={token} 
    name="Clonify Player" 
    offset={offset}
    locale={{
        next: "Damn"
    }}
    callback={(state) => {
        let currentDeviceId = state.currentDeviceId;
        let repeatState = state.repeat;
        setCurrentDevice(currentDeviceId); 
        if(repeatStatus != repeatTypes.indexOf(repeatState)) {            
            setRepeatStatus(repeatTypes.indexOf(repeatState))            
        } 
        setClickStatus(state.isPlaying);
        setCurrentTrack(state.track.uri);
        if(state.track.artists.length > 0) {
            localStorage.setItem("recentTrack", state.track.uri) 
        }           
        document.body.style.paddingBottom = `${item.current.ref.current.offsetHeight} px`;   
    }}  
    uris={uri} 
    components={{
        leftButton:<ShuffleBtn status={shuffleStatus} shuffle={shuffle} />, 
        rightButton: <RepeatBtn status={repeatStatus} repeat={repeat} />
    }}
    styles={{
        activeColor: "var(--clr-primary)",
        trackNameColor: "white",
        trackArtistColor: "grey",
        color: "white",
        sliderColor: "white",
        bgColor: "black",
        sliderHandleColor: "white"
    }}
    />
}


export default Player