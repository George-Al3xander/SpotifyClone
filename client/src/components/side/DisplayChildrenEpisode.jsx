import React, {useRef} from "react";
import {displayEpisodeDuration, displayEpisodeDate } from "../../utilityFunctions";
import moment from "moment";

const DisplayChildrenEpisode = ({episode,showUri, playStatus,firstItem,index, clickPlay, currentTrack, displayEpisode,offset}) => {
    const item = useRef();
   
    return(
    <div 
        ref={item}         
        onMouseEnter={() => {                                        
            item.current.style.backgroundColor = "var(--clr-bg-light)";
        }} 
        onMouseLeave={() => {    
            item.current.style.backgroundColor = "transparent"
        }}
        className="episode">
        <div className="episode-img">
            {index == 0 ? <img ref={firstItem} tabIndex="0" src={episode.img} alt="" /> : <img src={episode.img} alt="" />}
        </div>
        <div className="episode-titles">
            <h1 onClick={() => {displayEpisode(episode.id)}}>
                {episode.name}</h1>
            <p>{episode.description}</p>
            <div className="episode-btns">

            {(playStatus == true && currentTrack == episode.uri) ?
            <svg style={{fill: "var(--clr-primary)"}} onClick={async () =>{await clickPlay(episode.uri, showUri, (offset-index))}} xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M370-320h60v-320h-60v320Zm160 0h60v-320h-60v320ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Z"/></svg> 
                            
            :

            <svg onClick={async () => {               
               await clickPlay(episode.uri, showUri, (offset-index));
            }} xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="m383-310 267-170-267-170v340Zm97 230q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Z"/></svg>
            }
            {episode.isExpicit == true ? 
            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M360-288h240v-72H432v-84h168v-72H432v-84h168v-72H360v384ZM216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h528q29.7 0 50.85 21.15Q816-773.7 816-744v528q0 29.7-21.15 50.85Q773.7-144 744-144H216Z"/></svg>

            : 
            
            null
            }
            {episode.isExplicit == true ? <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M360-288h240v-72H432v-84h168v-72H432v-84h168v-72H360v384ZM216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h528q29.7 0 50.85 21.15Q816-773.7 816-744v528q0 29.7-21.15 50.85Q773.7-144 744-144H216Z"/></svg> : null }
            <p>
            {displayEpisodeDate(episode.date)} ·
            </p>
            
            <p>
            {displayEpisodeDuration(episode.duration)}
            </p>



            </div>
            </div>
    </div>)
}

export default DisplayChildrenEpisode