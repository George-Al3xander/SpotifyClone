import React, { useState } from "react";
import axios from 'axios';
import { Route, Routes , useNavigate} from "react-router-dom";
import useAuth from "../useAuth";
import SideMenu from "./SideMenu";
import Home from "./Home";
import  Search  from "./Search";
import Player from "./Player";
import {getSortedPlaylistTracks, msToTime } from "../../utilityFunctions";
import DisplayPlaylist from "../side/DisplayPlaylist";

const Dashboard = ({code}) => {
    const token = useAuth(code);
    const navigate = useNavigate();
    const[currentTrack, setCurrentTrack] = useState(
     // [
        "spotify:track:6gxJg7WCL5xdQCyhm4COF2",//"spotify:track:6wVnQMRXd1z2iPEo24f9db"
     // ]
    )
    const [curretPlaylist, setCurrentPlaylist] = useState({});
    const [clickStatus, setClickStatus] = useState(false);


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
    
    const testFunction = async () => {
      let playlist = await  getPlaylist("16rriBgSVvBmlMFw9gwYP0");
      console.log(playlist)
      setCurrentPlaylist(playlist);
      navigate("/playlist")
    }
    
    const getPlaylistNextTracks = async (apiId) => {
      const {data} = await axios.get(apiId, {
        headers: {
          Authorization: `Bearer ${token}`
        },        
      })
           
      if(data.next != null) {         
          return  data.items.concat(await getPlaylistNextTracks(data.next));         
      }  else {
        return  data.items
      }      
    }
    
    const getPlaylist = async (id) => { 
      console.log(1);
      let verySmall = "0J0osxjpvQiNkRxiF9CWI4"      
      let small  = "16rriBgSVvBmlMFw9gwYP0"      
      let big = "0xtweFcEO3q0LtNyahzkZN"                       
      const {data} = await axios.get(`https://api.spotify.com/v1/playlists/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },        
      });      
      let tracks =  data.tracks.items;  
      if(data.tracks.next != null) {        
        tracks = [...tracks].concat(await getPlaylistNextTracks(data.tracks.next));
      }   
      
      let duration =  msToTime(tracks);      
      tracks =  getSortedPlaylistTracks(tracks);
      
      let allTracksId = tracks.map((track) => {
        return track.id
      });       
     
      if(tracks.length > 50) {
        let fullCycles = Math.floor(tracks.length / 50);
        let howMuchLeft = Math.floor(tracks.length % 50);
        let arrMaxStart;
        let arrMaxEnd;
        for(let i = 0; i < fullCycles; i++) {
          let arrEnd = 50 * (i + 1);
          let arrStart = Math.abs(arrEnd - 50);
          let arr = allTracksId.slice(arrStart, arrEnd);    
          console.log(arr)        
          const {data} = await axios.get("https://api.spotify.com/v1/me/tracks/contains", {
          headers: {
            Authorization: `Bearer ${token}`
          },   
          params: {
            ids: arr.toString()
          }             
          });    
          let y = 0;      
          for(let x = arrStart; x < arrEnd; x++) {           
              tracks[x] = {...tracks[x], isFollowed: data[y]} 
              y++;
          }   
          if(i == fullCycles-1) {
            arrMaxStart = arrEnd;
          }     
        }
        arrMaxEnd = arrMaxStart + howMuchLeft;
        let arr = allTracksId.slice(arrMaxStart, arrMaxEnd);
        
        let isFollowed = await axios.get("https://api.spotify.com/v1/me/tracks/contains", {
        headers: {
          Authorization: `Bearer ${token}`
        },   
        params: {
          ids: arr.toString()
        }             
        });
        isFollowed = isFollowed.data;
  
        let y = 0;        
        for(let x = arrMaxStart; x < arrMaxEnd; x++) {
            tracks[x] = {...tracks[x], isFollowed: isFollowed[y]} 
            y++;
        }   
      } else {
        let isFollowed = await axios.get("https://api.spotify.com/v1/me/tracks/contains", {
        headers: {
          Authorization: `Bearer ${token}`
        },   
        params: {
          ids: allTracksId.toString()
        }             
        });
        isFollowed = isFollowed.data;
        let y = 0;        
        for(let x = 0; x < tracks.length; x++) {
            tracks[x] = {...tracks[x], isFollowed: isFollowed[y]} 
            y++;
        }
      }        

      return {
        tracks: tracks,
        name: data.name,
        description: data.description,
        followers: data.followers.total,
        owner: {
            display_name: data.owner.display_name,
            urls: data.owner.external_urls
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
      id = "01FCoGEQ3NFWF4fHJzdiax";
      const {data} = await axios.get(`https://api.spotify.com/v1/albums/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },        
      });      
      return data
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
      setCurrentTrack(uri);
     }
    }
    //Madvilliany
    //uri - "spotify:album:01FCoGEQ3NFWF4fHJzdiax"
    //id - "01FCoGEQ3NFWF4fHJzdiax"
    return (
      <>      
      <main className="container">
        <SideMenu />
        <div className="content">
          <Routes>
             <Route path="/" element={<Home />}/>
             <Route path="/playlist" element={<DisplayPlaylist playlist={curretPlaylist} clickTrack={clickTrack}/>}/>
            <Route path="/search" element={<Search />}/>
          </Routes>
        <input type="text" onChange={searchArtist}/>
        <button onClick={getPlaylist}>Get playlist</button>
        <button onClick={testFunction}>Test btn</button>
        </div>
      </main>
        <div className="player">
          <Player uri={currentTrack} clickStatus={clickStatus} token={token}/>
        </div>
      </>
    )
}

export default Dashboard;