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
    const[currentTrack, setCurrentTrack] = useState({
      name: "",
      uri: "spotify:track:6gxJg7WCL5xdQCyhm4COF2",
    })
    const [curretPlaylist, setCurrentPlaylist] = useState({});


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
      tracks =  tracks.filter((track) => track.track != null);      

      let duration = msToTime(tracks);
      tracks =  getSortedPlaylistTracks(tracks);
     
      let allTracksId = tracks.map((track) => {
        return track.id
      }); 
      let isTracksFollowed = []

      // for(let track of tracks) {
      //   let url = "https://api.spotify.com/v1/me/tracks/contains?ids=" + track.id
      //   const {data} = await axios.get(url, {
      //   headers: {
      //     Authorization: `Bearer ${token}`
      //   },   
             
      // });    
      //  allFollowedStatus.push(data[0]) 
      // } 
      
      let fullCycles = Math.floor(tracks.length / 50);
      let howMuchLeft = Math.floor(tracks.length % 50);
      let arrMaxStart;
      let arrMaxEnd;
      for(let i = 0; i < fullCycles; i++) {
        let arrEnd = 50 * (i + 1);
        let arrStart = Math.abs(arrEnd - 50);
        let arr = allTracksId.slice(arrStart, arrEnd);       
        let url = "https://api.spotify.com/v1/me/tracks/contains";
        const {data} = await axios.get(url, {
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

      let url = "https://api.spotify.com/v1/me/tracks/contains";
        let isFollowed = await axios.get(url, {
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


        console.log({
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
          img: data.images[0].url,
          duration: duration,
          isPublic: data.public
        })
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
        img: data.images[0].url,
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
             <Route path="/playlist" element={<DisplayPlaylist playlist={curretPlaylist}/>}/>
            <Route path="/search" element={<Search />}/>
          </Routes>
        <input type="text" onChange={searchArtist}/>
        <button onClick={getPlaylist}>Get playlist</button>
        <button onClick={testFunction}>Test btn</button>
        </div>
      </main>
        <div className="player">
          <Player uri={currentTrack.uri} token={token}/>
        </div>
      </>
    )
}

export default Dashboard;