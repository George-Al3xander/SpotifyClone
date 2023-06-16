import React, { useEffect, useRef, useState } from "react";
import axios from 'axios';
import { Route, Routes , useNavigate} from "react-router-dom";
import useAuth from "../useAuth";
import SideMenu from "./SideMenu";
import Home from "./Home";
import  Search  from "./Search";
import Player from "./Player";
import {getPlaylistTracks, msToTime, getAlbumTracks } from "../../utilityFunctions";
import DisplayPlaylist from "../side/DisplayPlaylist";

import { spotifyApi } from "react-spotify-web-playback";
import DisplayAlbum from "../side/DisplayAlbum";



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
  const [offset, setOffset] = useState(0)
  
  const playerItem = useRef()
 

  const getUser = async () => {
    const {data} = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }      
    })  
    console.log(data);
  }

  const testFunction = async () => { 
    //Basketball and download playlist have problems

    //All good with getPlaylist function
    let basketball = "0xtweFcEO3q0LtNyahzkZN";

    //Getting 400 error with getPlaylist function, with follow contain check
    let download = "3CLLxetdnYCrLwNoDiyV1G"

      console.log(await getPlaylist(download));    
  }

  const displayAlbum = async (id) => {
    let album = await getAlbum(id);
    setCurrentPlay(album);
    navigate("/album"); 
  }

  const displayPlaylist = async (id) => {    
    let playlist = await getPlaylist(id);
    setCurrentPlay(playlist);
    navigate("/playlist"); 
  }

  const  searchArtist =  async () => {
      
    const {data} = await axios.get("https://api.spotify.com/v1/search", {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      q: key,
      type: "track"
    }
  })    
  console.log(data)
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

    const getArtist = async (id) => {
      id = "7dGJo4pcD2V6oG8kP0tJRR" //Eminem
      const {data} = await axios.get(`https://api.spotify.com/v1/artists/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },        
      });

      console.log(data)
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

    const clickListPlay =  (uri) => {
      if(currentPlay.uri == uri) {
          setClickStatus(true);
      }
      else {          
          setCurrentPlayUri(uri);
          setOffset(0);
          setClickStatus(true);
        }
        
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

      console.log(data)
    }

    return (
      <>      
      <main className="container">
        <SideMenu 
            token={token} 
            playlistClick={displayPlaylist} 
            albumClick={displayAlbum}
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
                          />}/>
            <Route path="/search"  element={<Search token={token}/>}/>
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