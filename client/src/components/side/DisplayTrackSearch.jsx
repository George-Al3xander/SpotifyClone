import React, {useRef, useState} from "react";
import { displayTrackDuration} from "../../utilityFunctions";

const DisplayTrackSearch = ({track,currentTrack, clickTrack, followTrack, unfollowTrack, playStatus,num}) => {    
    const [isHovered, setIsHovered] = useState(false);
    const item = useRef();
    const itemImg = useRef();
    const header1 = useRef();    
    if(currentTrack == track.uri && playStatus == true) {
        itemImg.current.style.opacity = ".3"
    } 
    else {
        if(itemImg.current  != undefined) {
            itemImg.current.style.opacity = "1"
        }

    }
    return(
        <tr 
            
            key={track.id}   
            ref={item}                  
            onDoubleClick={()=> {
                props.clickTrack(track.uri);
            }}
            onMouseEnter={() => {                     
                setIsHovered(true);                            
                item.current.style.backgroundColor = "var(--clr-bg-light)" ;
                header1.current.style.opacity = "1";                
                itemImg.current.style.opacity = ".3";
            }} 
            onMouseLeave={() => {                           
                setIsHovered(false); 
                item.current.style.backgroundColor = "transparent"
                header1.current.style.opacity = ".7";                
                itemImg.current.style.opacity = "1";
            }}
                id={track.uri} className="track track-search" >
                    
                    <td className="track-main-info">
                        <div className="search-track-btn"><img ref={itemImg} src={track.img} alt="Album cover" />
                        {isHovered == true ? 
                            (currentTrack == track.uri && playStatus == true) ?
                        
                            <svg onClick={clickTrack} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M560-200v-560h160v560H560Zm-320 0v-560h160v560H240Z"/></svg>

                            :
                            <svg   onClick={clickTrack} xmlns="http://www.w3.org/2000/svg" height="25" viewBox="0 -960 960 960" width="25"><path d="M336-216v-528l408 264-408 264Z"/></svg>
                        
                            
                        : 


                            (currentTrack == track.uri && playStatus == true) ?
                        
                            <svg onClick={clickTrack} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M560-200v-560h160v560H560Zm-320 0v-560h160v560H240Z"/></svg>

                            :
                            
                            null 
                        }
                        </div>
                        </td>   
                                             
                        <td className="track-name">
                            {currentTrack == track.uri ? <h1 style={{color : "#1DB954"}}>{track.name}</h1> : <h1>{track.name}</h1> }        
                            <h2 ref={header1} className="track-artist">
                                {track.isExplicit == true ? <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M360-288h240v-72H432v-84h168v-72H432v-84h168v-72H360v384ZM216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h528q29.7 0 50.85 21.15Q816-773.7 816-744v528q0 29.7-21.15 50.85Q773.7-144 744-144H216Z"/></svg> : null }
                                {track.artists.map((artist) => {
                                    return <>
                                    <a href={artist.external_urls.spotify}>{artist.name}</a> {track.artists.indexOf(artist) != track.artists.length-1 ? ", " : null}
                                    </>
                                })}
                            </h2>                                
                        </td> 
                    
                    
                    
                   
                    
                       
                    <td>
                            {track.isFollowed == true ? 
                            
                            <svg onClick={async () => {
                                await unfollowTrack(track.id, num);
                            }}  style={{fill: "var(--clr-primary"}} xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="m480-144-50-45q-100-89-165-152.5t-102.5-113Q125-504 110.5-545T96-629q0-89 61-150t150-61q49 0 95 21t78 59q32-38 78-59t95-21q89 0 150 61t61 150q0 43-14 83t-51.5 89q-37.5 49-103 113.5T528-187l-48 43Z"/></svg> 

                            : 

                            isHovered == true ? 
                            
                            <svg 
                                onClick={async () => {
                                await followTrack(track.id, num);
                                }}                                 
                            xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="m480-144-50-45q-100-89-165-152.5t-102.5-113Q125-504 110.5-545T96-629q0-89 61-150t150-61q49 0 95 21t78 59q32-38 78-59t95-21q89 0 150 61t61 150q0 43-14 83t-51.5 89q-37.5 49-103 113.5T528-187l-48 43Zm0-97q93-83 153-141.5t95.5-102Q764-528 778-562t14-67q0-59-40-99t-99-40q-35 0-65.5 14.5T535-713l-35 41h-40l-35-41q-22-26-53.5-40.5T307-768q-59 0-99 40t-40 99q0 33 13 65.5t47.5 75.5q34.5 43 95 102T480-241Zm0-264Z"/></svg> 
                            : 
                            <svg style={{opacity: "0"}} xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="m480-144-50-45q-100-89-165-152.5t-102.5-113Q125-504 110.5-545T96-629q0-89 61-150t150-61q49 0 95 21t78 59q32-38 78-59t95-21q89 0 150 61t61 150q0 43-14 83t-51.5 89q-37.5 49-103 113.5T528-187l-48 43Z"/></svg>
                            }                                
                    </td>
                    <td>
                        <h2>{displayTrackDuration(track.duration)}</h2>
                    </td>
                </tr>
)
}

export default DisplayTrackSearch