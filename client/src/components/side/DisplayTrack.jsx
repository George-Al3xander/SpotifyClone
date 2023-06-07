import React, { useState, useRef,useEffect } from "react";
import { displayTrackDuration, getDateSorted} from "../../utilityFunctions";

const DisplayTracks = (props) => { 
    const itemsRef = useRef([]);
    let arr = props.array.map(() => {
        return {status: false}
    }) 
    const [isHovered, setIsHovered] = useState(arr);
    useEffect(()=> {
        itemsRef.current = itemsRef.current.slice(0, props.array.length);               
    },[props.array])


    const test = () => {
        console.log(1)
    }
    
    
    return (
        <table className="tracks">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Album</th>
                    <th>Date added</th>
                    <th><svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="m614-310 51-51-149-149v-210h-72v240l170 170ZM480-96q-79.376 0-149.188-30Q261-156 208.5-208.5T126-330.958q-30-69.959-30-149.5Q96-560 126-630t82.5-122q52.5-52 122.458-82 69.959-30 149.5-30 79.542 0 149.548 30.24 70.007 30.24 121.792 82.08 51.786 51.84 81.994 121.92T864-480q0 79.376-30 149.188Q804-261 752-208.5T629.869-126Q559.738-96 480-96Zm0-384Zm.477 312q129.477 0 220.5-91.5T792-480.477q0-129.477-91.023-220.5T480.477-792Q351-792 259.5-700.977t-91.5 220.5Q168-351 259.5-259.5T480.477-168Z"/></svg></th>
                </tr>
            </thead>

            <tbody>
            {props.array.map((track, num) => {                
                        return <tr 
                        key={num} 
                        ref={el => itemsRef.current[num] = el} 
                        onMouseEnter={() => {                     
                            
                            // // .innerHTML = `<svg  xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/></svg>`;
                            // if(track.isFollowed == false) {
                            //     itemsRef.current[num].lastChild.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="m480-144-50-45q-100-89-165-152.5t-102.5-113Q125-504 110.5-545T96-629q0-89 61-150t150-61q49 0 95 21t78 59q32-38 78-59t95-21q89 0 150 61t61 150q0 43-14 83t-51.5 89q-37.5 49-103 113.5T528-187l-48 43Zm0-97q93-83 153-141.5t95.5-102Q764-528 778-562t14-67q0-59-40-99t-99-40q-35 0-65.5 14.5T535-713l-35 41h-40l-35-41q-22-26-53.5-40.5T307-768q-59 0-99 40t-40 99q0 33 13 65.5t47.5 75.5q34.5 43 95 102T480-241Zm0-264Z"/></svg>`
                            // } 
                            let tempArray = [...isHovered];
                            tempArray[num].status = true;
                            setIsHovered(tempArray);
                            
                                                     
                        }} 
                        onMouseLeave={() => {
                            // let tempArray = [...isHovered];
                            // tempArray[num].status = false;
                            // setIsHovered(tempArray);
                            // itemsRef.current[num].firstChild.innerHTML = num + 1;
                            // if(track.isFollowed == false) {
                            //     itemsRef.current[num].lastChild.innerHTML = ` `
                            // } 
                            let tempArray = [...isHovered];
                            tempArray[num].status = false;
                            setIsHovered(tempArray);
                        }}
                        onClick={props.clickTrack} id={track.uri} className="track" >
                            <td className="track-play-btn">
                            {isHovered[num].status == false ? (num + 1) : <svg onClick={() => {                               
                                props.clickTrack(
                                    props.playlistUri
                                   // itemsRef.current[num].id
                                    
                                    );
                            }}  xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/></svg> }</td>
                            <td><img src={track.img[64]} alt="Album cover" /></td>
                            <td style={{textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
                            <div className="track-name">
                                <div>
                                    <h1>{track.name}</h1>
                                </div>
                                <div>
                                    {track.isExplicit == true ? <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="M360-288h240v-72H432v-84h168v-72H432v-84h168v-72H360v384ZM216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h528q29.7 0 50.85 21.15Q816-773.7 816-744v528q0 29.7-21.15 50.85Q773.7-144 744-144H216Zm0-72h528v-528H216v528Zm0-528v528-528Z"/></svg> : null }
                                    {track.artists.map((artist) => {
                                        return <h2><a href={artist.external_urls.spotify}>{artist.name}</a></h2>
                                        
                                    })}
                                </div>
                            </div>                                
                            </td>
                            <td className="track-extra-info">
                                <h2>
                                    {track.album.name}
                                </h2>
                            </td>
                            <td className="track-extra-info"> 
                                <h2>
                                    {getDateSorted(track.date)}
                                </h2>
                            </td>
                            <td>
                                {track.isFollowed == true ? <svg style={{fill: "green"}} xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="m480-144-50-45q-100-89-165-152.5t-102.5-113Q125-504 110.5-545T96-629q0-89 61-150t150-61q49 0 95 21t78 59q32-38 78-59t95-21q89 0 150 61t61 150q0 43-14 83t-51.5 89q-37.5 49-103 113.5T528-187l-48 43Zm0-97q93-83 153-141.5t95.5-102Q764-528 778-562t14-67q0-59-40-99t-99-40q-35 0-65.5 14.5T535-713l-35 41h-40l-35-41q-22-26-53.5-40.5T307-768q-59 0-99 40t-40 99q0 33 13 65.5t47.5 75.5q34.5 43 95 102T480-241Zm0-264Z"/></svg> 
                                : 
                                isHovered[num].status == true ? <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="m480-144-50-45q-100-89-165-152.5t-102.5-113Q125-504 110.5-545T96-629q0-89 61-150t150-61q49 0 95 21t78 59q32-38 78-59t95-21q89 0 150 61t61 150q0 43-14 83t-51.5 89q-37.5 49-103 113.5T528-187l-48 43Zm0-97q93-83 153-141.5t95.5-102Q764-528 778-562t14-67q0-59-40-99t-99-40q-35 0-65.5 14.5T535-713l-35 41h-40l-35-41q-22-26-53.5-40.5T307-768q-59 0-99 40t-40 99q0 33 13 65.5t47.5 75.5q34.5 43 95 102T480-241Zm0-264Z"/></svg> : null}
                                {displayTrackDuration(track.duration)}
                            </td>
                    </tr>
                })}

            </tbody>
        </table>
    )
    
}

export default DisplayTracks