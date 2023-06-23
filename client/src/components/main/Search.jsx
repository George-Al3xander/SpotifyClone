import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import defaultUserPic from "../../assets/images/pic-user-default.png"
import DisplaySearchResults from "../side/Search/DisplaySearchResults";
import { similarity } from "../../utilityFunctions";
import DisplaySearchItem from "../side/Search/DisplaySearchItem";
const Search = ({token, displayAlbum, displayPlaylist, displayShow}) => {
    const [searchKey, setSearchKey] = useState("");
    const [resultsTracks, setResultsTracks] = useState([]);
    const [resultsArtists, setResultsArtists] = useState([]);
    const [resultsAlbums, setResultsAlbums] = useState([]);   
    const [resultsPlaylists, setResultsPlaylists] = useState([]);
    const [resultsShows, setResultsShows] = useState([]);   
    const [resultsEpisodes, setResultsEpisodes] = useState([]);   
    const [topResult, setTopResult] = useState({})
    let topResFunction;

    const itemDiv = useRef();
    const itemSvg = useRef();

    let coond = (resultsAlbums != undefined && resultsArtists != undefined && resultsPlaylists != undefined && resultsTracks != undefined && topResult.item != undefined) 
       

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
            let shows = await data.shows;
            let episodes = await data.episodes;   
                    
            
            setResultsPlaylists(playlists.items.map((list) => {
               return  {
                    name: list.name,     
                    owner: list.owner.display_name,                    
                    img: (list.images == undefined || list.images.length == 0) ?

                    defaultUserPic
                    : 
                    list.images.length > 1 ?

                    list.images[1].url
                    : 
                    list.images[0].url,                 
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
                     img: (list.images == undefined || list.images.length == 0) ?

                     defaultUserPic
                     : 
                     list.images.length > 1 ?
 
                     list.images[1].url
                     : 
                     list.images[0].url,                
                     id: list.id,
                     uri: list.uri,
                  }
             })) 
            setResultsArtists(artists.items.map((artist) => {
                return {
                    name: artist.name,
                    img: (artist.images == undefined || artist.images.length == 0) ?

                    defaultUserPic
                    : 
                    artist.images.length > 1 ?

                    artist.images[1].url
                    : 
                    artist.images[0].url,                    
                    id: artist.id,
                    uri: artist.uri,
                }
            }))
            setResultsShows(shows.items.map((show) => {
                return {
                    name: show.name,     
                     owner: show.publisher,                    
                     img: show.images.length > 1 ?  show.images[1].url
                        : show.images[0].url,                
                     id: show.id,
                     uri: show.uri,
                }
            }))
            setResultsEpisodes(episodes.items.map((episode) => {
                return {
                    name: episode.name,     
                    duration: episode.duration_ms,                
                    img: episode.images.length > 1 ?  episode.images[1].url
                        : episode.images[0].url,                
                    id: episode.id,
                    uri: episode.uri,
                    date: episode.release_date

                }
            }))           
            let topResults = [];
            topResults.push({
                type: "artists",
                item: resultsArtists[0]
            })
            topResults.push({
                type: "tracks",
                item: resultsTracks[0]
            })
            topResults.push({
                type: "albums",
                item: resultsAlbums[0]
            })
            topResults.push({
                type: "playlists",
                item: resultsPlaylists[0]
            })
            topResults.push({
                type: "podcasts",
                item: resultsShows[0]
            })
            topResults.push({
                type: "episodes",
                item: resultsEpisodes[0]
            })
            let valid = new RegExp(`${searchKey.toLowerCase()}`)

            let topRes = topResults.map((result) => {
                return similarity(searchKey,result.item.name)
            })
            let topResultNum = topRes.indexOf(Math.max(...topRes));
            let res = topResults[topResultNum];
            
            setTopResult(res);
        }

        setEverything();
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

            <div className="search-results">
                {(coond && searchKey != "") ? 
                <>
                <div>
                    <div>
                        <h1>Top result</h1>
                        <DisplaySearchItem 
                            item={topResult.item} 
                            type={topResult.type}
                            func={(id) => {                                
                                if(topResult.type == "playlists") {
                                    displayPlaylist(id)
                                }
                                else if(topResult.type == "albums") {
                                    displayAlbum(id)
                                }
                                else if(topResult.type == "podcasts") {
                                    displayShow(id);
                                }
                                else if(topResult.type == "episode") {

                                }
                                else {
                                    console.log(id)
                                }
                            }} 
                        />
                    </div>
                </div>
                <DisplaySearchResults 
                       array={resultsArtists} 
                       type={"artists"}
                />      
                <DisplaySearchResults 
                        array={resultsAlbums} 
                        type={"albums"}
                        func={displayAlbum}
                />
                <DisplaySearchResults 
                        array={resultsPlaylists} 
                        type={"playlists"}
                        func={displayPlaylist}
                /> 
                <DisplaySearchResults 
                        array={resultsShows} 
                        type={"podcasts"}
                        func={displayShow}
                />

                <DisplaySearchResults 
                        array={resultsEpisodes} 
                        type={"episodes"}
                        func={() => {

                        }}
                />
                
                
                </>
                
                
                :null


                }                
            </div>
        </div>
    )
}

export default Search