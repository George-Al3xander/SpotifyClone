import React, { useState } from "react";
import axios from 'axios';
import { Route, Routes } from "react-router-dom";
import useAuth from "../useAuth";
import SideMenu from "./SideMenu";
import Home from "./Home";
import  Search  from "./Search";
import Player from "./Player";
const Dashboard = ({code}) => {
    const token = useAuth(code);

    const[currentTrack, setCurrentTrack] = useState({
      name: "",
      uri: "spotify:track:6gxJg7WCL5xdQCyhm4COF2",
    })

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

    const getTopArtists = async () => {
        const {data} = await axios.get("https://api.spotify.com/v1/me/albums", {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })    
    console.log(data)
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
      const {data} = await axios.get(`https://api.spotify.com/v1/playlists/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },        
      });
      let tracks = data.tracks.items;        
      if(data.tracks.next != null) {        
        tracks = [...tracks].concat(await getPlaylistNextTracks(data.tracks.next));
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
        img: data.images
      }
    }

    const getAlbum = async (id) => {     
      id = "01FCoGEQ3NFWF4fHJzdiax"
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
              <Route path="/search" element={<Search />}/>
          </Routes>
        <input type="text" onChange={searchArtist}/>
        <button onClick={getPlaylist}>Get playlist</button>
        <button onClick={getAlbum}>Test btn</button>
        </div>
      </main>
        <div className="player">
          <Player uri={currentTrack.uri} token={token}/>
        </div>
      </>
    )
}

export default Dashboard;