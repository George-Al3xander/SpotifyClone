import React, {useRef} from "react";
import { displayTrackDuration, getDateSorted} from "../../utilityFunctions";

const DisplayTrack = (props) => {
    //types : album, playlist, search
    const item = useRef();
    const header1 = useRef();
    const header2= useRef();
    let track = props.track;    
    let type = props.type;
    let num = props.num;
    let isHovered = props.isHovered;
    let setIsHovered = props.setIsHovered;
    let currentTrack = props.currentTrack;
    let clickTrack = props.clickTrack;
    return(
            <tr
                key={track.id}   
                ref={item}                  
                onDoubleClick={()=> {
                    props.clickTrack(track.uri);
                }}
                onMouseEnter={() => { 
                    let tempArray = [...isHovered];
                    tempArray[num].status = true;
                    setIsHovered(tempArray);                            
                    item.current.style.backgroundColor = "var(--clr-bg-light)" ;
                    header1.current.style.opacity = "1" ;
                    if(type == "playlist") {
                        header2.current.style.opacity = "1" ;
                    }
                }} 
                onMouseLeave={() => {                           
                    let tempArray = [...isHovered];
                    tempArray[num].status = false;
                    setIsHovered(tempArray);
                    item.current.style.backgroundColor = "transparent"
                    header1.current.style.opacity = ".7" ;
                    if(type == "playlist") {
                        header2.current.style.opacity = ".7" ;
                    }
                }}
                    id={track.uri} className="track" >
                            {type == "album" || "playlist" ? 
                            <td className="track-play-btn">
                            {isHovered[num].status == false ? 
                             
                            <h2>{num + 1}</h2>                                
                            :              
                            <svg
                            onClick={() => {
                                //e.preventDefault();
                                clickTrack(track.uri);
                            }}  xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/></svg> }
                        </td> :
                            null
                        }   

                            <td className="track-main-info">
                                {type != "album" ? 
                                <div>
                                    <img src={track.img[64]} alt="Album cover" />
                                </div>
                                : null}
            
                            <div className="track-name">
                                {currentTrack == track.uri ? <h1 style={{color : "#1DB954"}}>{track.name}</h1> : <h1>{track.name}</h1> }        
                                <h2 ref={header1} className="track-artist">
                                    {track.isExplicit == true ? <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M360-288h240v-72H432v-84h168v-72H432v-84h168v-72H360v384ZM216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h528q29.7 0 50.85 21.15Q816-773.7 816-744v528q0 29.7-21.15 50.85Q773.7-144 744-144H216Zm0-72h528v-528H216v528Zm0-528v528-528Z"/></svg> : null }
                                    {track.artists.map((artist) => {
                                        return <>
                                        <a href={artist.external_urls.spotify}>{artist.name}</a> {track.artists.indexOf(artist) != track.artists.length-1 ? ", " : null}
                                        </>
                                    })}
                                </h2>                                
                            </div>                                
                            </td>
                            {type == "playlist" ? 
                                <td className="track-extra-info  track-album-name">
                                    <h2 ref={header2} id={track.album.uri}>
                                        {track.album.name}
                                    </h2>
                                </td>  
                            : null}

                            {type == "playlist" ?  
                                <td className="track-extra-info"> 
                                     <h2>
                                        {getDateSorted(track.date)}
                                    </h2>
                                </td> 
                            : null}
                           
                            <td>
                                {track.isFollowed == true ? <svg style={{fill: "green"}} xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="m480-144-50-45q-100-89-165-152.5t-102.5-113Q125-504 110.5-545T96-629q0-89 61-150t150-61q49 0 95 21t78 59q32-38 78-59t95-21q89 0 150 61t61 150q0 43-14 83t-51.5 89q-37.5 49-103 113.5T528-187l-48 43Zm0-97q93-83 153-141.5t95.5-102Q764-528 778-562t14-67q0-59-40-99t-99-40q-35 0-65.5 14.5T535-713l-35 41h-40l-35-41q-22-26-53.5-40.5T307-768q-59 0-99 40t-40 99q0 33 13 65.5t47.5 75.5q34.5 43 95 102T480-241Zm0-264Z"/></svg> 
                                : 
                                isHovered[num].status == true ? <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="m480-144-50-45q-100-89-165-152.5t-102.5-113Q125-504 110.5-545T96-629q0-89 61-150t150-61q49 0 95 21t78 59q32-38 78-59t95-21q89 0 150 61t61 150q0 43-14 83t-51.5 89q-37.5 49-103 113.5T528-187l-48 43Zm0-97q93-83 153-141.5t95.5-102Q764-528 778-562t14-67q0-59-40-99t-99-40q-35 0-65.5 14.5T535-713l-35 41h-40l-35-41q-22-26-53.5-40.5T307-768q-59 0-99 40t-40 99q0 33 13 65.5t47.5 75.5q34.5 43 95 102T480-241Zm0-264Z"/></svg> : null}                                
                            </td>
                            <td>
                                <h2>{displayTrackDuration(track.duration)}</h2>
                            </td>
                    </tr>
    )
}

export default DisplayTrack