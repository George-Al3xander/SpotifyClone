import React, { useState, useRef,useEffect } from "react";
import DisplayTrack from "./DisplayTrack";
import { spotifyApi } from "react-spotify-web-playback";

const DisplayTracks = (props) => { 
    let token = props.token;
    let type = props.type;
    let currentPlay = props.currentPlay
    let setCurrentPlay = props.setCurrentPlay
    const itemsRef = useRef([]);
    let arr = props.array.map(() => {
        return {status: false}
    }) ;
    const [isHovered, setIsHovered] = useState(arr);
    useEffect(()=> {
        itemsRef.current = itemsRef.current.slice(0, props.array.length);               
    },[props.array]);    

    const followTrack = async (id,num) => {
        await spotifyApi.saveTracks(token, id);
        let temppArray = currentPlay;
        temppArray.tracks[num].isFollowed = true;
        setCurrentPlay(temppArray);
    }

    const unfollowTrack = async (id,num) => {
        await spotifyApi.removeTracks(token, id)
        let temppArray = currentPlay;
        temppArray.tracks[num].isFollowed = false;
        setCurrentPlay(temppArray);
    }
    
        return (
        <table  className="tracks">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Title</th>
                    {type == "playlist" ? <th className="track-extra-info">Album</th> : null}
                    {type == "playlist" ? <th className="track-extra-info">Date added</th> : null}
                    <th></th>
                    <th><svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="m614-310 51-51-149-149v-210h-72v240l170 170ZM480-96q-79.376 0-149.188-30Q261-156 208.5-208.5T126-330.958q-30-69.959-30-149.5Q96-560 126-630t82.5-122q52.5-52 122.458-82 69.959-30 149.5-30 79.542 0 149.548 30.24 70.007 30.24 121.792 82.08 51.786 51.84 81.994 121.92T864-480q0 79.376-30 149.188Q804-261 752-208.5T629.869-126Q559.738-96 480-96Zm0-384Zm.477 312q129.477 0 220.5-91.5T792-480.477q0-129.477-91.023-220.5T480.477-792Q351-792 259.5-700.977t-91.5 220.5Q168-351 259.5-259.5T480.477-168Z"/></svg></th>
                </tr>
            </thead>

            <tbody>
            {props.array.map((track, num) => {     
                return <DisplayTrack 
                        followTrack={followTrack} 
                        unfollowTrack={unfollowTrack} 
                        currentTrack={props.currentTrack} 
                        track={track} type={type} 
                        clickTrack={() => {
                            props.clickTrack(num)
                        }} 
                        num={num} 
                        isHovered={isHovered} 
                        setOffset={props.setOffset}
                        currentPlayUri = {props.currentPlayUri}
                        currentPlaylistUri={props.currentPlay.uri}
                        setIsHovered={setIsHovered}/>  
                })}

            </tbody>
        </table>
    )
    
}

export default DisplayTracks