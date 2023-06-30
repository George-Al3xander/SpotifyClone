import loadingGif from "../../assets/images/loading.gif"
import React from "react";
import { displayEpisodeDate, displayEpisodeDuration } from "../../utilityFunctions";
const DisplayParentEpisode = ({episode, playStatus,clickPlay, currentTrack, setPlayStatus, displayShow, isLoading}) => {
   
   return(
    isLoading == true ? 

                <div className="loading-screen"><img src={loadingGif} alt="" /> </div>
                : 
    <div className="list">
        <div className="episode-parent list-top">
                <div className="list-top-img">
                <img style={{borderRadius: "1rem"}} src={episode.img} alt="" />    
                </div>  
                <div className="list-top-titles">
                    <h3>Podcast Episode</h3>
                    <h1>{episode.name}</h1>                    
                    <h2 onClick={() => {
                displayShow(episode.podcast.id)
            }}>{episode.podcast.name}</h2>
                </div>              
        </div>

        <div className="episode-btns"><p>{displayEpisodeDate(episode.date)} ·</p> 
        <p>{displayEpisodeDuration(episode.duration)}</p></div>

        <div className="list-btns">
            {
            isLoading == true ? 

            <img alt="loading" className="loading-gif" src={loadingGif}></img>

            :
            
            ( playStatus == true &&  currentTrack == episode.uri) ?
            <svg style={{fill: "var(--clr-primary)"}} onClick={async () => {await clickPlay(episode)}} xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M370-320h60v-320h-60v320Zm160 0h60v-320h-60v320ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Z"/></svg> 
                            
            :

            <svg onClick={async () => {await clickPlay(episode)}} xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="m383-310 267-170-267-170v340Zm97 230q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Z"/></svg>
            }      
    
                {/* Tree dots */}
                <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M207.858-432Q188-432 174-446.142q-14-14.141-14-34Q160-500 174.142-514q14.141-14 34-14Q228-528 242-513.858q14 14.141 14 34Q256-460 241.858-446q-14.141 14-34 14Zm272 0Q460-432 446-446.142q-14-14.141-14-34Q432-500 446.142-514q14.141-14 34-14Q500-528 514-513.858q14 14.141 14 34Q528-460 513.858-446q-14.141 14-34 14Zm272 0Q732-432 718-446.142q-14-14.141-14-34Q704-500 718.142-514q14.141-14 34-14Q772-528 786-513.858q14 14.141 14 34Q800-460 785.858-446q-14.141 14-34 14Z"/></svg>            
        </div>
        
        <div className="episode-bottom">
            <div>
                <h1>Episode Description</h1>
                <p>{episode.description}</p>
            </div>
            <button onClick={() => {
                displayShow(episode.podcast.id)
            }}>See all episodes</button>
        </div>
        


    </div>
   ) 
}

export default DisplayParentEpisode