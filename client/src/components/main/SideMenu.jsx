import React, { useState } from "react";
import axios from 'axios';
import DisplaySideMenuContent from "../side/DisplaySideMenuContent";
import { getNextItems } from "../../utilityFunctions";


const SideMenu = ({playlistClick, albumClick, token,currentPlayUri, clickStatus}) => {
    
    const getPlaylists = async () => {
        const {data} = await axios.get('https://api.spotify.com/v1/me/playlists?limit=50', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        let playlist = data.items;
       if(data.next != null) {
           playlist =  playlist.concat(await getNextItems(token, data.next));
       }
       playlist = playlist.filter((list) => list.tracks.total > 0)       
       playlist = playlist.map((list) => {
            return  {
                name: list.name,     
                owner: list.owner.display_name,                    
                img: list.images.length > 1 ?  list.images[2].url
                   : list.images[0].url,                
                id: list.id,
                uri: list.uri,
             }
        });
        
        return playlist
    }

    const getAlbums = async () => {
        const {data} = await axios.get('https://api.spotify.com/v1/me/albums?limit=50', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
       let album = data.items;
       if(data.next != null) {
           album =  album.concat(await getNextItems(token, data.next));
       }
        album = album.filter((item) => item.album.name != "")
        album = album.map((list) => {
            return  {
                name: list.album.name,     
                owner: list.album.artists[0].name,                    
                img: list.album.images.length > 1 ?  list.album.images[2].url
                   : list.album.images[0].url,                
                id: list.album.id,
                uri: list.album.uri,
             }
        });
        
        return album
    }

    const clickPlaylistNavBtn = async () => {
        setCurrentDisplay(await getPlaylists());
        
        setIsClicked(true);
        setCurrentDisplayType("playlist")
    }

    const clickAlbumNavBtn = async () => {
        setCurrentDisplay(await getAlbums());
        
        setIsClicked(true);
        setCurrentDisplayType("album");
    }

    const cancelClick = () => {
        setIsClicked(false);
        setCurrentDisplayType("")
    }


    const [searchType, setSearchType] = useState("");
    const [currentDisplay, setCurrentDisplay] = useState({});
    const [currentDisplayType, setCurrentDisplayType] = useState("");
    const [isClicked, setIsClicked] = useState(false)
    return(
        <div className="side-menu">
            <div className="side-menu-top-nav">
                <div><svg style={{fill: "white"}} xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40"><path d="M226.666-186.666h140.001v-246.667h226.666v246.667h140.001v-380.001L480-756.667l-253.334 190v380.001ZM160-120v-480l320-240 320 240v480H526.667v-246.667h-93.334V-120H160Zm320-352Z"/></svg><h1>Home</h1></div>
                <div><svg style={{fill: "white"}} xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40"><path d="M792-120.667 532.667-380q-30 25.333-69.64 39.666Q423.388-326 378.667-326q-108.441 0-183.554-75.167Q120-476.333 120-583.333T195.167-765.5q75.166-75.167 182.5-75.167 107.333 0 182.166 75.167 74.834 75.167 74.834 182.267 0 43.233-14 82.9-14 39.666-40.667 73l260 258.667-48 47.999ZM378-392.666q79.167 0 134.583-55.834Q568-504.333 568-583.333q0-79.001-55.417-134.834Q457.167-774 378-774q-79.722 0-135.528 55.833t-55.806 134.834q0 79 55.806 134.833Q298.278-392.666 378-392.666Z"/></svg> <h1>Search</h1></div>
            </div>            
            <div className="side-menu-content">                
                    <h1>Your Library</h1>    
                    <ul className="side-menu-content-nav">
                        {isClicked == false ? <><li onClick={clickPlaylistNavBtn}>Playlist</li>
                        <li>Podcast & Shows</li>
                        <li onClick={clickAlbumNavBtn}>Albums</li>
                        <li>Artists</li></> 
                        :
                        <div style={{display: "flex", alignItems: "center", gap: ".5rem"}}>
                        <svg style={{fill: "var(--clr-bg-light)"}} onClick={cancelClick} xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 -960 960 960" width="30"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>
                        <li onClick={cancelClick} 
                            style={{
                                textTransform: "capitalize",
                                backgroundColor: "white",
                                color: "black",
                                opacity: "1"
                                }}>
                                {currentDisplayType}
                        </li>
                        </div> 
                        }
                    </ul>                       
                    <div><input type="text" /></div>

                    {isClicked == false ? 
                    
                    null 
                    
                    :
                    <DisplaySideMenuContent 
                        functions={[playlistClick,albumClick]} 
                        type={currentDisplayType} 
                        array={currentDisplay}
                        currentPlayUri={currentPlayUri}
                        clickStatus={clickStatus}
                        />}
                    {/* / Component/ */}
                    
            </div>
        </div>
    )
}


export default SideMenu