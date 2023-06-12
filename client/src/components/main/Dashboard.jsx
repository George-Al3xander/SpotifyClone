import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Route, Routes , useNavigate} from "react-router-dom";
import useAuth from "../useAuth";
import SideMenu from "./SideMenu";
import Home from "./Home";
import  Search  from "./Search";
import Player from "./Player";
import {getSortedPlaylistTracks, getPlaylistTracks, msToTime, getAlbumTracks } from "../../utilityFunctions";
import DisplayPlaylist from "../side/DisplayPlaylist";

import { spotifyApi } from "react-spotify-web-playback";
import DisplayAlbum from "../side/DisplayAlbum";



const Dashboard = ({code}) => {
  const token =  useAuth(code);  
  const navigate = useNavigate();
  const[currentTrack, setCurrentTrack] = useState("spotify:track:6gxJg7WCL5xdQCyhm4COF2");
  const [currentPlayUri, setCurrentPlayUri] = useState("")
  const [currentPlay, setCurrentPlay] = useState({});
  const [clickStatus, setClickStatus] = useState(false);
  const [empty, setEmpty] = useState("")
  const [currentDevice, setCurrentDevice] = useState("");
  const [shuffleStatus, setShuffleStatus] = useState(false);
  const repeatTypes = ['off', 'context' , 'track' ]
  const [repeatStatus, setRepeatStatus] = useState(0);
  const [currentUser, setCurrentUser] = useState({})
  
 

  const getUser = async () => {
    const {data} = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }      
    })  
    console.log(data);
  }
  
  

  const testFunction = async () => { 
     await getSavedTracks();
       
  }



  const displayAlbum = async () => {
    let album = await getAlbum("01FCoGEQ3NFWF4fHJzdiax");
    setCurrentPlay(album);
    navigate("/album"); 
  }

  const displayPlaylist = async () => {
    let playlist = await getPlaylist("0J0osxjpvQiNkRxiF9CWI4");
    setCurrentPlay(playlist);
    navigate("/playlist"); 
  }


  useEffect(() => {
    //const {devices} = spotifyApi.getDevices(token);
    //console.log(devices)
  }, [currentDevice])
  
  const  searchArtist =  async (e) => {
      let key = e.target.value;
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
  
    const getNextItems = async (apiId) => {
      const {data} = await axios.get(apiId, {
        headers: {
          Authorization: `Bearer ${token}`
        },        
      })
           
      if(data.next != null) {         
          return  data.items.concat(await getNextItems(data.next));         
      }  else {
        return  data.items
      }      
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
      // let followStatus = await axios.get(`https://api.spotify.com/v1/playlists/${data.id}/followers/contains?ids=jmperezperez%2Cthelinmichael%2Cwizzler`)
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
        img: {
          640: data.images[0].url,
          300: data.images[1].url,
          64: data.images[2].url,
        },
        
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

    const clickTrack = (uri) => { 
      if(currentTrack == uri) {
        if(clickStatus == false) {
           setClickStatus(true)
        }
        else {   
         setClickStatus(false)
        }        
      } else {
        setClickStatus(true)
      }
      
     if(typeof uri == "string") {
      setCurrentPlayUri(uri);
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
    
    const clickListPlay = async (uri) => {
      console.log(uri)
      
      setCurrentPlayUri(uri);
      await spotifyApi.play(token, {
        context_uri: uri,
        deviceId: currentDevice,
        uris: uri
      });
      setClickStatus(true);
    }
    

    const getSavedTracks = async () => {
      const {data} = await axios.get('https://api.spotify.com/v1/me/tracks?limit=50', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      console.log(data)
    }

    

    //Madvilliany
    //uri - "spotify:album:01FCoGEQ3NFWF4fHJzdiax"
    //id - "01FCoGEQ3NFWF4fHJzdiax"
    return (
      <>      
      <main className="container">
        <SideMenu 
            token={token} 
            playlistClick={displayPlaylist} 
            albumClick={displayAlbum}
            getNextItems={getNextItems}
            />
        <div className="content">
          <Routes>
             <Route path="/" element={<Home />}/>
             <Route path="/playlist" currentTrack={currentPlayUri} element={<DisplayPlaylist clickPlay={clickListPlay} currentTrack={currentPlay} playlist={currentPlay} clickTrack={clickTrack}/>}/>
             <Route path="/album" element={<DisplayAlbum currentTrack={currentTrack} album={currentPlay} clickPlay={clickListPlay} clickTrack={clickTrack}/>}/>
            <Route path="/search" element={<Search />}/>
          </Routes>
        <input type="text" onChange={searchArtist}/>
        <button onClick={getPlaylist}>Get playlist</button>
        <button onClick={testFunction}>Test btn</button>
        <button onClick={getQueue}>Get Q</button>
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
            />
        </div>
      </>
    )
}

export default Dashboard;