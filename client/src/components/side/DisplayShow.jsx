import React, { useEffect, useRef, useState } from "react";
import DisplayEpisode from "./DisplayChildrenEpisode";
import { getShowsEpisodes } from "../../utilityFunctions";
import axios from "axios";

const DisplayShow = ({show, token, currentTrack, currentPlayUri, playStatus,setPlayStatus, clickPlay, displayEpisode}) => {   
    const [episodes, setEpisodes] = useState(show.episodes); 
    useEffect(() => {
        setEpisodes(show.episodes)
    },[show])
    console.log(episodes)
    const [count, setCount] = useState(0); 
    const firstItem = useRef();    
    const previousEpisodes = async () => {
        const {data} = await axios.get(episodes.previous, {
            headers: {
                  Authorization: `Bearer ${token}`
          },            
        })        
        let episodesPrev = data.items.map((episode) => {
          return {
            name: episode.name,                              
            img: episode.images.length > 1 ?  episode.images[1].url
            : episode.images[0].url,                
            id: episode.id,
            uri: episode.uri,
            data: episode.release_date,
            description: episode.description,
            isExplicit: episode.explicit,
            duration: episode.duration_ms
          }
        })
        
        setEpisodes({
            items: episodesPrev,
            next: data.next,
            previous: data.previous
        })  
        firstItem.current.focus();           
    }

    const nextEpisodes = async () => {
        const {data} = await axios.get(episodes.next, {
            headers: {
                  Authorization: `Bearer ${token}`
          },            
        })        
        let episodesNext = data.items.map((episode) => {
          return {
            name: episode.name,                              
            img: episode.images.length > 1 ?  episode.images[1].url
            : episode.images[0].url,                
            id: episode.id,
            uri: episode.uri,
            data: episode.release_date,
            description: episode.description,
            isExplicit: episode.explicit,
            duration: episode.duration_ms
          }
        })
        
        setEpisodes({
            items: episodesNext,
            next: data.next,
            previous: data.previous
        }) 
        firstItem.current.focus();  
    }
    
    
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

            <div>
                {episodes.previous != null ? 
                <button className="btn-episode" onClick={previousEpisodes}>Previous episodes</button>
                :
                null
                }
                {episodes.items.map((episode) => {
                    return <DisplayEpisode   
                          currentPlayUri={currentPlayUri}
                          playStatus={playStatus} 
                          episode={episode}
                          firstItem={firstItem}
                          setPlayStatus={setPlayStatus}
                          clickPlay={clickPlay}
                          showUri={show.uri}
                          currentTrack={currentTrack}
                          displayEpisode={displayEpisode}
                          num={episodes.items.indexOf(episode)}
                          />
                })}
                {episodes.next != null ? 
                <button className="btn-episode" onClick={nextEpisodes}>Next episodes</button>
                :
                null
                }
            </div>
        </div>
    )
}


export default DisplayShow