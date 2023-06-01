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
        const {data} = await axios.get("https://api.spotify.com/v1/me/playlists ", {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })    
    console.log(data)
    }

    const getPlaylistTracks = async (apiId) => {
      const {data} = await axios.get(apiId, {
        headers: {
          Authorization: `Bearer ${token}`
        },        
      })
      let tracks = data.items;    
      console.log(data)    
      if(data.next != null) {
        return [...tracks].concat(getPlaylistTracks(data.next));
      }

      return tracks
    }
    
    const getPlaylist = async (id) => {  
      let currentApi;
      let small  = "16rriBgSVvBmlMFw9gwYP0"
      let big = "0xtweFcEO3q0LtNyahzkZN"
      id = big
      const {data} = await axios.get(`https://api.spotify.com/v1/playlists/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },        
      })
      let tracks = data.tracks.items;   
      console.log(data.tracks.next)
      if(data.tracks.next != null) {        
        tracks = [...tracks].concat(getPlaylistTracks(data.tracks.next));
      } else {
        tracks = data.tracks.items;         
      }      
      
      console.log(tracks);
      return {
        name: data.name
      }
    }

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
        <button onClick={getTopArtists}>Get ALL playlists</button>
        </div>
      </main>
        <div className="player">
          <Player uri={currentTrack.uri} token={token}/>
        </div>
      </>
    )
}

export default Dashboard;