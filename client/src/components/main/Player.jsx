import React, { useRef } from "react";
import  SpotifyPlayer from "react-spotify-web-playback"
import ShuffleBtn from "../side/ShuffleBtn";
import RepeatBtn from "../side/RepeatBtn";
const Player = ({token, uri, clickStatus, setCurrentDevice, shuffle, shuffleStatus, repeatStatus, repeat, setRepeatStatus, setCurrentTrack,setClickStatus}) => {
  const repeatTypes = ['off', 'context' , 'track' ] 
  const item = useRef();  
    return <SpotifyPlayer 
    ref={item} 
    play={clickStatus}     
    hideAttribution={true}
    token={token}  
    callback={async (state) => {
        let currentDeviceId = state.currentDeviceId;
        let repeatState = state.repeat;
        setCurrentDevice(currentDeviceId);                
        //console.log(repeatStatus, repeatTypes.indexOf(repeatState))     
        if(repeatStatus != repeatTypes.indexOf(repeatState)) {            
            setRepeatStatus(repeatTypes.indexOf(repeatState))            
        }
        setClickStatus(state.isActive);
        setCurrentTrack(state.track.uri);       
        document.body.style.paddingBottom = `${item.current.ref.current.offsetHeight} px`;        
    }}  
    uris={uri} 
    components={{
        leftButton:<ShuffleBtn status={shuffleStatus} shuffle={shuffle} />, 
        rightButton: <RepeatBtn status={repeatStatus} repeat={repeat} />
    }}
    styles={{
        activeColor: "white",
        trackNameColor: "white",
        trackArtistColor: "grey",
        color: "white",
        sliderColor: "white",
        bgColor: "black"
    }}
    />
}


export default Player