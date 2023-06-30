import React, { useEffect, useRef, useState } from "react";
import DisplayEpisode from "./DisplayChildrenEpisode";
import { getShowsEpisodes } from "../../utilityFunctions";
import loadingGif from "../../assets/images/loading.gif"
import axios from "axios";

const DisplayShow = ({show, token, currentTrack, currentPlayUri, playStatus,setPlayStatus, clickPlay, displayEpisode,isLoading}) => {   
    const [offset, setOffset] = useState(show.total-1);
    const [episodes, setEpisodes] = useState(show.episodes); 
   
    useEffect(() => {
        setEpisodes(show.episodes)
        setOffset(show.total-1);
    },[show])
    
   
   
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
        setOffset((prev) => prev + 20);
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
        setOffset((prev) => prev - 20);
        setEpisodes({
            items: episodesNext,
            next: data.next,
            previous: data.previous
        }) 
        firstItem.current.focus();  
    }
    
    
    return(
        isLoading == true ? 

                <div className="loading-screen"><img src={loadingGif} alt="" /> </div>
                : 
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
            <div className="show-description">
                <h1>About</h1>
                <p>{show.description}</p>
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
                          offset={offset}
                          index={episodes.items.indexOf(episode)
                        }
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