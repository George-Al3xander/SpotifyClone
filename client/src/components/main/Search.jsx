import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import DisplaySearchResults from "../side/Search/DisplaySearchResults";
const Search = ({token}) => {
    const [searchKey, setSearchKey] = useState("");
    const [resultsTracks, setResultsTracks] = useState([]);
    const [resultsArtists, setResultsArtists] = useState([]);
    const [resultsAlbums, setResultsAlbums] = useState([]);   
    const [resultsPlaylists, setResultsPlaylists] = useState([]);   
    const itemDiv = useRef();
    const itemSvg = useRef();
    //Results
    // Top res - Songs
    //Artists
    //Albums
    //Playlists
    

    const  searchItems =  async () => {      
        const {data} = await axios.get("https://api.spotify.com/v1/search", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: searchKey,
                limit: 4,
                type: "album,artist,playlist,track,show,episode"
            }
        })    
        return data
    }

    useEffect(() => {
        
        const setEverything =  async () => {
            const data = await searchItems();
            let tracks = await data.tracks;
            let artists = await data.artists;
            let albums = await data.albums;
            let playlists = await data.playlists;

           
            console.log(artists)
            

            setResultsPlaylists(playlists.items.map((list) => {
               return  {
                    name: list.name,     
                    owner: list.owner.display_name,                    
                    img: list.images.length > 1 ?  list.images[2].url
                       : list.images[0].url,                
                    id: list.id,
                    uri: list.uri,
                 }
            }))

            setResultsTracks(tracks.items.map((track) => {
                return  {
                     name: track.name,     
                     owner: track.artists,                    
                     img: track.album.images.length > 1 ?  track.album.images[2].url
                        : track.album.images[0].url,                
                     id: track.id,
                     uri: track.uri,
                  }
             }))

            setResultsAlbums(albums.items.map((list) => {
                return  {
                     name: list.name,     
                     owner: list.artists,                    
                     img: list.images.length > 1 ?  list.images[2].url
                        : list.images[0].url,                
                     id: list.id,
                     uri: list.uri,
                  }
             })) 
            setResultsArtists(artists.items.map((artist) => {
                return {
                    name: artist.name,
                    img: artist.images.length > 1 ?  artist.images[2].url
                        : artist.images[0].url,
                    id: artist.id,
                    uri: artist.uri,
                }
            }))


        }

        setEverything();
        console.log(resultsAlbums)
        
    }, [searchKey])
    return(
        <div className="search">
            <div ref={itemDiv} className="search-field">
            <svg ref={itemSvg} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
            <input 
                onFocus={() => {
                    itemDiv.current.style.border = "1px solid white"
                    itemSvg.current.style.opacity = "1"
                }} 
                onBlur={() => {
                    itemDiv.current.style.border = "none"
                    itemSvg.current.style.opacity = ".7"
                }}
                onChange={(e) => {
                    setSearchKey(e.target.value)
                }}
                
                placeholder="What do you want to listen to?" type="text" />

            </div>

            <div className="results">
                {searchKey == "" ? 
                    (resultsAlbums != undefined && resultsArtists != undefined && resultsPlaylists != undefined && resultsTracks != undefined) 
                    
                    :
                    
                    <DisplaySearchResults array={resultsAlbums} type={"album"} />
                   
                    }
            </div>
        </div>
    )
}

export default Search