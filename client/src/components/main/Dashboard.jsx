import React, { useEffect, useRef, useState } from "react";
import axios from 'axios';
import { Route, Routes , useNavigate} from "react-router-dom";
import useAuth from "../useAuth";
import SideMenu from "./SideMenu";
import Home from "./Home";
import  Search  from "./Search";
import Player from "./Player";
import {getPlaylistTracks, msToTime, getAlbumTracks, getShowsEpisodes } from "../../utilityFunctions";
import DisplayPlaylist from "../side/DisplayPlaylist";
import { spotifyApi } from "react-spotify-web-playback";
import DisplayAlbum from "../side/DisplayAlbum";
import DisplayShow from "../side/DisplayShow";
import DisplayParentEpisode from "../side/DisplayParentEpisode";



const Dashboard = ({code}) => {
  const token =  useAuth(code);  
  const navigate = useNavigate();
  const[currentTrack, setCurrentTrack] = useState("");
  const [currentPlayUri, setCurrentPlayUri] = useState(localStorage.getItem("recentTrack"))
  const [currentPlay, setCurrentPlay] = useState({});
  const [currentPlayingListUri , setCurrentPlayingListUri] = useState("")
  const [clickStatus, setClickStatus] = useState(false); 
  const [currentDevice, setCurrentDevice] = useState("");
  const [shuffleStatus, setShuffleStatus] = useState(false);
  const repeatTypes = ['off', 'context' , 'track' ]
  const [repeatStatus, setRepeatStatus] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState("")

  

  const testFunction = async () => { 
    //spotify:show:4rOoJ6Egrf8K2IrywzwOMk
    //"spotify:episode:5NnstGx7gYZ5hNgwlTULl6"
    displayEpisode("5NnstGx7gYZ5hNgwlTULl6")
    //console.log(await getEpisode("5NnstGx7gYZ5hNgwlTULl6"))
  }
  
  const displayAlbum = async (id) => {
    setIsLoading(true);
    let album;
    if(localStorage.getItem(id) == null) {
      album = await getAlbum(id);
        localStorage.setItem(id, JSON.stringify(album))
    } else {
      album = JSON.parse(localStorage.getItem(id))
    }
    setCurrentPlay(album);
    setIsLoading(false);
    navigate("/album");    
  }

  const displayPlaylist = async (id) => {  
    setIsLoading(true);
    let playlist; 
    if(localStorage.getItem(id) == null) {
      playlist = await getPlaylist(id);
      localStorage.setItem(id, JSON.stringify(playlist))
    } else {
      playlist =  JSON.parse(localStorage.getItem(id))
    }    
    setCurrentPlay(playlist);
    setIsLoading(false);
    navigate("/playlist"); 
    setTimeout(async () => {
      let playlistApi = await getPlaylist(id);      
      let playlistStorage = JSON.parse(localStorage.getItem(id));
      if(playlistApi.tracks.length != playlistStorage.tracks.length) {
        localStorage.setItem(id, JSON.stringify(playlistApi)); 
        setCurrentPlay(playlistApi);         
      }
    })
  }

  const displayShow = async (id) => {
    let show;
    if(localStorage.getItem(id) == null) {
      show = await getShow(id);
      localStorage.setItem(id, JSON.stringify(show))
    } else {
      show =  JSON.parse(localStorage.getItem(id))
    }
    setCurrentPlay(show);
    navigate("/show")

    setTimeout(async () => {
      let showApi = await getShow(id);      
      let showStorage = JSON.parse(localStorage.getItem(id));
     
      if(showApi.total != showStorage.total) {
        localStorage.setItem(id, JSON.stringify(showApi)); 
        setCurrentPlay(showApi);      
        console.log('Here')   
      }
    },1)
    
  }

  const displayEpisode = async (id) => {
    let episode;

    if(localStorage.getItem(id) == null) {
      episode = await getEpisode(id);
      localStorage.setItem(id, JSON.stringify(episode))
    } else {
      episode =  JSON.parse(localStorage.getItem(id))
    }
    setCurrentPlay(episode);
    navigate("/episode")
  }
 
    const getPlaylist = async (id) => {       
      let verySmall = "0J0osxjpvQiNkRxiF9CWI4"      
      let small  = "16rriBgSVvBmlMFw9gwYP0"      
      let big = "0xtweFcEO3q0LtNyahzkZN"                       
      const {data} = await axios.get(`https://api.spotify.com/v1/playlists/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },        
      }); 
      let tracks = await  getPlaylistTracks(token,data.tracks);      
      let duration = msToTime(tracks);     
      return {
        tracks: tracks,
        name: data.name,
        description: data.description,
        followers: data.followers.total,
        owner: {
            display_name: data.owner.display_name,
            urls: data.owner.external_urls,
            id: data.owner.id
        },
        id: data.id,
        uri: data.uri,
        img: data.images.length > 1 ? data.images[1].url : data.images[0].url,
        
        duration: duration,
        isPublic: data.public
      }
    }
   
    const getAlbum = async (id) => { 
      const {data} = await axios.get(`https://api.spotify.com/v1/albums/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },        
      });      
      let tracks = await getAlbumTracks(token, data.tracks.items);
      let duration = msToTime(tracks);     

      return {
        artists: data.artists,
        id: data.id,
        uri: data.uri,
            img: {
              640: data.images[0].url,
              300: data.images[1].url,
              64: data.images[2].url,
        },
        duration: duration,
        tracks: tracks,
        name: data.name,
        date: data.release_date
      }
    }

    const getShow = async (id) => {
        const {data} = await axios.get(`https://api.spotify.com/v1/shows/${id}` , {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })        
        let episodes = await getShowsEpisodes(token, data.id)        
        let show = {
                name: data.name,     
                owner: data.publisher,                    
                img: data.images.length > 1 ?  data.images[1].url
                   : data.images[0].url,                
                id: data.id,
                uri: data.uri,
                description: data.description,
                isExplicit: data.explicit,
                episodes: episodes,
                total: data.total_episodes
        }        
        return show
    }

    const getEpisode = async (id) => {
      const {data} = await axios.get(`https://api.spotify.com/v1/episodes/${id}` , {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      
      return {
        name: data.name,                              
        img: data.images.length > 1 ?  data.images[1].url
        : data.images[0].url,                
        id: data.id,
        uri: data.uri,
        date: data.release_date,
        description: data.description,
        isExplicit: data.explicit,
        duration: data.duration_ms,  
        podcast: {
          name: data.show.name,
          id: data.show.id,
          uri: data.show.uri,
        }      
      }
    }
   
    const clickTrack = async  (trackUri, thisListUri,num) => { 
      let list = thisListUri;
      if(currentTrack == trackUri && currentPlayUri == thisListUri) {
          if(clickStatus == false) {
              setClickStatus(true);
          } else {
            setClickStatus(false);
          }
      }
      else if (currentTrack != trackUri && currentPlayUri == thisListUri) {           
      await spotifyApi.play(token, {
          context_uri: currentPlayUri,
          deviceId: currentDevice,
          offset: num,
          uris: currentPlayUri
          })
              
      }
      else {
          setCurrentPlayUri(thisListUri);
          setOffset(num);
          setClickStatus(true)
      } 
    }

    const clickListPlay = (uri) => {
      if(currentPlay.uri == uri) {
          setClickStatus(true);
      }
      else {          
          setCurrentPlayUri(uri);
          setOffset(0);
          setClickStatus(true);
        }
    }

    const clickEpisodePlay = async (episodeUri,showUri) => {
      if(currentEpisode == episodeUri) {
        if(clickStatus == false) {
          setClickStatus(true);
        } else {
          setClickStatus(false);
        }
      }
      else {
        await spotifyApi.play(token, {
          context_uri: showUri,
          deviceId: currentDevice,          
          uris: episodeUri
          })
      }
      setCurrentPlayUri(showUri);
      setCurrentEpisode(episodeUri);
    }

    const shuffle = () => {
      if(shuffleStatus == false) {
        spotifyApi.shuffle(token,true, currentDevice);
        setShuffleStatus(true);
        }
      else {
        spotifyApi.shuffle(token,true, currentDevice);
        setShuffleStatus(false);       
      }
    }
  
    const repeat = () => {
      if(repeatStatus + 1 > 2) {
        setRepeatStatus(0);
      } else {
        setRepeatStatus((prev) => prev + 1)
      }
    }
    useEffect(()=> {
      const doThis = async() => {
        await spotifyApi.repeat(token,repeatTypes[repeatStatus],currentDevice);
      }
      doThis();
    },[repeatStatus])


    const getQueue = async () => {
      console.log(await spotifyApi.getQueue(token))
    }
    
    const getSavedTracks = async () => {
      const {data} = await axios.get('https://api.spotify.com/v1/me/tracks?limit=50', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      
    }
    

    return (
      <>      
      <button onClick={testFunction}>Click that mofo</button>
      <main className="container">
        <SideMenu 
            token={token} 
            playlistClick={displayPlaylist} 
            albumClick={displayAlbum}
            showClick={displayShow}
            currentPlayUri={currentPlayUri}
            clickStatus={clickStatus}
            setCurrentPlayUri={setCurrentPlayUri}
        />
        <div className="content">
          <Routes>
             <Route path="/" element={<Home />}/>
             <Route path="/playlist"  
             element={<DisplayPlaylist 
                          clickPlay={clickListPlay} 
                          currentTrack={currentTrack}  
                          currentPlayUri={currentPlayUri}
                          setCurrentPlayUri={setCurrentPlayUri}
                          playlist={currentPlay} 
                          clickTrack={clickTrack} 
                          token={token}
                          currentPlay={currentPlay}
                          setCurrentPlay={setCurrentPlay}
                          playStatus={clickStatus}
                          setPlayStatus={setClickStatus} 
                          setOffset={setOffset}
                          isLoading={isLoading}                         
                          />}/>
             <Route path="/album" 
             element={<DisplayAlbum 
                          clickPlay={clickListPlay} 
                          currentTrack={currentTrack}  
                          currentPlayUri={currentPlayUri}
                          setCurrentPlayUri={setCurrentPlayUri}
                          album={currentPlay} 
                          clickTrack={clickTrack} 
                          token={token}
                          currentPlay={currentPlay}
                          setCurrentPlay={setCurrentPlay}
                          playStatus={clickStatus}
                          setPlayStatus={setClickStatus} 
                          setOffset={setOffset}
                          isLoading={isLoading}  
              />}/>
            <Route path="/show" 
            element={<DisplayShow 
                          token={token}
                          show={currentPlay}
                          currentTrack={currentEpisode}  
                          currentPlayUri={currentPlayUri}
                          setCurrentPlayUri={setCurrentPlayUri}
                          setCurrentPlay={setCurrentPlay}  
                          playStatus={clickStatus}
                          displayEpisode={displayEpisode}
                          setPlayStatus={() => {
                            spotifyApi.pause(token,currentDevice);
                          }} 
                          clickPlay={clickEpisodePlay}
            />}/>
            <Route path="/episode" 
            element={<DisplayParentEpisode 
                          token={token}
                          episode={currentPlay}
                          currentTrack={currentEpisode}  
                          currentPlayUri={currentPlayUri}
                          setCurrentPlayUri={setCurrentPlayUri}
                          setCurrentPlay={setCurrentPlay}  
                          playStatus={clickStatus} 
                          clickPlay={clickEpisodePlay}
                          displayShow={displayShow}
                          setPlayStatus={() => {
                            spotifyApi.pause(token,currentDevice);
                          }}

            />}            
            />
            <Route path="/search"  
            element={<Search 
                          token={token}
                          displayAlbum={displayAlbum}
                          displayPlaylist={displayPlaylist}
                          displayShow={displayShow}
            />}/>
          </Routes>          
        </div>
      </main>
        <div className="player">
          <Player 
              shuffle={shuffle} 
              shuffleStatus={shuffleStatus} 
              repeat={repeat}
              repeatStatus={repeatStatus}
              setCurrentDevice={setCurrentDevice} 
              uri={currentPlayUri} 
              clickStatus={clickStatus} 
              token={token}           
              setRepeatStatus={setRepeatStatus}
              setCurrentTrack={setCurrentTrack}
              setClickStatus={setClickStatus}
              offset={offset}
            />
        </div>
      </>
    )
}

export default Dashboard;