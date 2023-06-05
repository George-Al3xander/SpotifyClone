import React, { useState } from "react";
import axios from 'axios';
import { Route, Routes , useNavigate} from "react-router-dom";
import useAuth from "../useAuth";
import SideMenu from "./SideMenu";
import Home from "./Home";
import  Search  from "./Search";
import Player from "./Player";
import { getSortedPlaylistTracks, msToTime } from "../../utilityFunctions";
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
      // let verySmall = "0J0osxjpvQiNkRxiF9CWI4"
      // let small  = "16rriBgSVvBmlMFw9gwYP0"      
       let big = "0xtweFcEO3q0LtNyahzkZN"  
      let playlist = await getPlaylist(big);   
      // let url = playlist.tracks.reduce((curr, next) => {
      //   if(playlist.tracks.indexOf(curr) < 49) {
      //     return curr + `%20${next.id}`
      //   }
      // },"https://api.spotify.com/v1/me/tracks/contains?ids=")
      let url = "https://api.spotify.com/v1/me/tracks/contains?ids=" + playlist.tracks[0].id
      const {data} = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        },   
             
      });    
      console.log(data[0])  
      // setCurrentPlaylist(playlist);
      // navigate("/playlist")
              
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
     
      let allFollowedStatus = []; 
      for(let track of tracks) {
        console.log(tracks)
        let url = "https://api.spotify.com/v1/me/tracks/contains?ids=" + track.id
        const {isFollowed} = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        },   
             
        }); 
        allFollowedStatus.push(isFollowed[0]);
      }

      console.log(tracks)

      

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