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
import Header from "./Header";



const Dashboard = ({code, setCode}) => {
  const token =  useAuth(code);  
  const navigate = useNavigate();
  const[currentTrack, setCurrentTrack] = useState("");

  const setRecentTrack = () => {
    localStorage.setItem("recentTrack", "")
    return ""
  }
  const [currentPlayUri, setCurrentPlayUri] = useState(
    localStorage.getItem("recentTrack") != null ? localStorage.getItem("recentTrack") : setRecentTrack());   
  const [currentPlaylist, setCurrentPlaylist] = useState({});  
  const [currentAlbum, setCurrentAlbum] = useState({});  
  const [currentShow, setCurrentShow] = useState({});  
  const [currentDisplayEpisode, setCurrentDisplayEpisode] = useState({});  
  const [currentSearch, setCurrentSearch] = useState({});  
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {    
    const checkUser = async () => {
      if(Object.keys(currentUser).length === 0 && token != undefined) {
        const {data} = await axios.get(`https://api.spotify.com/v1/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          },        
        });        
        setCurrentUser({
          name: data.display_name,
          link: data.external_urls.spotify,
          img: data.images[0].url,
          id: data.id,
          uri: data.uri
        })

      }
    }

    checkUser();
    
  }, [token])
  
  
  const [clickStatus, setClickStatus] = useState(false); 
  const [currentDevice, setCurrentDevice] = useState("");
  const [shuffleStatus, setShuffleStatus] = useState(false);
  const repeatTypes = ['off', 'context', 'track' ]
  const [repeatStatus, setRepeatStatus] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState("");

  const testFunction = async () => { 
    const {data} = await axios.get(`https://api.spotify.com/v1/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          },        
        });

      console.log(data)
  } 
  
  const displayAlbum = async (id) => {
    setIsLoading(true);
    navigate("/album");    
    let album;
    if(localStorage.getItem(id) == null) {
      album = await getAlbum(id);
        localStorage.setItem(id, JSON.stringify(album))
    } else {
      album = JSON.parse(localStorage.getItem(id))
    }
    setCurrentAlbum(album);
    setIsLoading(false);
  }

  const displayPlaylist = async (id) => {  
    setIsLoading(true);
    navigate("/playlist"); 
    let playlist; 
    if(localStorage.getItem(id) == null) {
      playlist = await getPlaylist(id);
      localStorage.setItem(id, JSON.stringify(playlist))
    } else {
      playlist =  JSON.parse(localStorage.getItem(id))
    }    
    console.log(playlist);
    setCurrentPlaylist(playlist);
    setIsLoading(false);
    setTimeout(async () => {
      let playlistApi = await getPlaylist(id);      
      let playlistStorage = JSON.parse(localStorage.getItem(id));
      if(playlistApi.tracks.length != playlistStorage.tracks.length) {
        localStorage.setItem(id, JSON.stringify(playlistApi)); 
        setCurrentPlaylist(playlistApi);         
      }
    })
  }

  const displayShow = async (id) => {
    setIsLoading(true);
    navigate("/show");

    let show;
    if(localStorage.getItem(id) == null) {
      show = await getShow(id);
      localStorage.setItem(id, JSON.stringify(show))
    } else {
      show =  JSON.parse(localStorage.getItem(id))
    }
    setCurrentShow(show);

    setTimeout(async () => {
      let showApi = await getShow(id);      
      let showStorage = JSON.parse(localStorage.getItem(id));
     
      if(showApi.total != showStorage.total) {
        localStorage.setItem(id, JSON.stringify(showApi)); 
        setCurrentShow(showApi);      
        console.log('Here')   
      }
    },1)
    setIsLoading(false);
    
  }

  const displayEpisode = async (id) => {
    setIsLoading(true);
    navigate("/episode");
    let episode;

    if(localStorage.getItem(id) == null) {
      episode = await getEpisode(id);
      localStorage.setItem(id, JSON.stringify(episode))
    } else {
      episode =  JSON.parse(localStorage.getItem(id))
    }
    setCurrentDisplayEpisode(episode);
    setIsLoading(false);
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
      let isFollowed = await axios.get(`https://api.spotify.com/v1/playlists/${data.id}/followers/contains?ids=${currentUser.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },        
      });
      isFollowed = isFollowed.data[0]
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
        isPublic: data.public,
        isFollowed: isFollowed
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
          total: data.show.total_episodes
        }      
      }
    }
   
    const clickTrack = async  (trackUri, thisListUri,num) => { 
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
      if(currentPlaylist.uri == uri) {
          setClickStatus(true);
      }
      else {          
          setCurrentPlayUri(uri);
          setOffset(0);
          setClickStatus(true);
        }
    }

    const clickEpisodePlay = async (episodeUri,showUri, num) => {
      if(currentEpisode == episodeUri) {
            if(clickStatus == false) {
              setClickStatus(true);
            } else {
              setClickStatus(false);
            }
      }
      else {
          spotifyApi.play(token, {
            context_uri: showUri,
            deviceId: currentDevice,
            offset: num,
            uris: showUri
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
    },[repeatStatus]);

    const getEpisodeOffset = async (episodeId, data, total) => {      
      for(let i = 0; i < data.items.length; i++) {
        if(episodeId != data.items[i].id) {
          total = total - 1;
        }
        else {          
          return total         
        }
      }
      if(data.next != null) {        
        let next = await axios.get(data.next, {
        headers: {
            Authorization: `Bearer ${token}`
        },            
        });
        next = next.data;
        return await getEpisodeOffset(episodeId, next, total);
      } 
      return total

    }


    const clickParentEpisodePlay = async (episode) => {
      if(currentEpisode == episode.uri) {
            if(clickStatus == false) {
              setClickStatus(true);
            } else {
              setClickStatus(false);
            }
      }
      else {
        let podcast = episode.podcast;
        let total =  episode.podcast.total-1;
        setIsLoading(true);
        let id = podcast.id;
        const {data} = await axios.get(`https://api.spotify.com/v1/shows/${id}/episodes?limit=50`, {
          headers: {
              Authorization: `Bearer ${token}`
          },            
        });
        let num = await getEpisodeOffset(episode.id, data, total);
        spotifyApi.play(token, {
          context_uri: podcast.uri,
          deviceId: currentDevice,
          offset: num,
          uris: podcast.uri
        });    
        setCurrentPlayUri(podcast.uri);
        setOffset(num);
        setClickStatus(true)  
        console.log(num)
        setIsLoading(false);
      
      }
      
      setCurrentEpisode(episode.uri);
    }

    const logout = async() => {
      const url = 'https://www.spotify.com/logout/'                                                                                                      
      const spotifyLogoutWindow = window.open(url, 'Spotify Logout', 'width=700,height=500,top=40,left=40')                                                                                                
      setTimeout(() => spotifyLogoutWindow.close(), 2000)
      setCode(null)
    }
    
    return (
      <>   
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
        <Header user={currentUser} logout={logout}/>         
          <Routes>
             <Route path="/" element={<Home />}/>
             <Route path="/playlist"  
             element={<DisplayPlaylist 
                          clickPlay={clickListPlay} 
                          currentTrack={currentTrack}  
                          currentPlayUri={currentPlayUri}
                          setCurrentPlayUri={setCurrentPlayUri}
                          playlist={currentPlaylist} 
                          clickTrack={clickTrack} 
                          token={token}
                          currentPlay={currentPlaylist}
                          setCurrentPlay={setCurrentPlaylist}
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
                          album={currentAlbum} 
                          clickTrack={clickTrack} 
                          token={token}
                          currentPlay={currentAlbum}
                          setCurrentPlay={setCurrentAlbum}
                          playStatus={clickStatus}
                          setPlayStatus={setClickStatus} 
                          setOffset={setOffset}
                          isLoading={isLoading}  
              />}/>
            <Route path="/show" 
            element={<DisplayShow 
                          token={token}
                          show={currentShow}
                          currentTrack={currentEpisode}  
                          currentPlayUri={currentPlayUri}
                          setCurrentPlayUri={setCurrentPlayUri}
                          setCurrentPlay={setCurrentShow}  
                          playStatus={clickStatus}
                          displayEpisode={displayEpisode}
                          setPlayStatus={() => {
                            spotifyApi.pause(token,currentDevice);
                          }} 
                          clickPlay={clickEpisodePlay}
                          setOffset={setOffset}
                          isLoading={isLoading}                         


            />}/>
            <Route path="/episode" 
            element={<DisplayParentEpisode 
                          token={token}
                          episode={currentDisplayEpisode}
                          currentTrack={currentEpisode}  
                          currentPlayUri={currentPlayUri}
                          setCurrentPlayUri={setCurrentPlayUri}
                          setCurrentPlay={setCurrentDisplayEpisode}  
                          setPlayStatus={() => {
                            setClickStatus(false)
                          }}
                          playStatus={clickStatus} 
                          clickPlay = {clickParentEpisodePlay}
                          displayShow={displayShow}
                          isLoading={isLoading}

                          

            />}            
            />
            <Route path="/search"  
            element={<Search 
                          token={token}
                          displayAlbum={displayAlbum}
                          displayPlaylist={displayPlaylist}
                          displayShow={displayShow}
                          displayEpisode={displayEpisode}
                          currentTrack={currentTrack}  
                          clickTrack={(trackUri) => {
                            if(currentTrack == trackUri) {
                              if(clickStatus == false) {
                                setClickStatus(true);
                              } else {
                                setClickStatus(false);
                              }
                            } else {
                              setCurrentPlayUri(trackUri);
                              setOffset(0);
                              setClickStatus(true);
                            }
                          }} 
                          playStatus={clickStatus}
                          currentPlay={currentSearch}
                          setCurrentPlay={setCurrentSearch}
                          currentPlayUri={currentPlayUri}
                          
                          
                            
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