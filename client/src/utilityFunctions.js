import moment from "moment"
import axios from "axios";

export function msToTime(tracks) {
    let duration = tracks.reduce((prev,curr) => {                 
        return  prev + curr.duration            
      }, 0);        
              
      let seconds = Math.floor((duration / 1000) % 60);
      let minutes = Math.floor((duration / (1000 * 60)) % 60);
      let hours;
      //Check if length greater than 24, because results might be different
      let tempHours = Math.floor(duration * .27777777777778 * 0.000001);
      tempHours <= 24 ? hours = Math.floor((duration / (1000 * 60 * 60)) % 24) : hours =  Math.floor(duration * .27777777777778 * 0.000001);
      
      if(hours == 0) {
          return `${minutes} min ${seconds} sec`          
      } else {
          return `${hours} hr ${minutes} min`          
      } 
}





export function getSortedPlaylistTracks(tracks) {
    tracks = tracks.filter((track) => track.track != null && track.track.name != "");     
           

    tracks = tracks.map((song) => {                 
        return  {
            name: song.track.name,
            uri: song.track.uri, 
            id: song.track.id, 
            isExplicit: song.track.explicit, 
            img: {
                640: song.track.album.images[0].url,
                300: song.track.album.images[1].url,
                64: song.track.album.images[2].url,
            },
            album: {
                name: song.track.album.name,
                uri: song.track.album.uri,
            },
            duration: song.track.duration_ms,
            artists: song.track.album.artists,
            date: song.added_at
        }
    })

    return tracks
}



export async function getPlaylistTracks(token,tracksStart) {
  //tracksStart = data.tracks
  let tracks =  tracksStart.items;  
  let next = tracksStart.next;
      if(next != null) {        
        tracks = [...tracks].concat(await getPlaylistNextTracks(next));
      }   
      
      tracks = await getSortedPlaylistTracks(tracks);
      
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

      return tracks
}

export async function getAlbumTracks(token, tracks) {
    tracks =  tracks.map((track) => {
      return {
        name: track.name,
        artists: track.artists,
        duration: track.duration_ms,
        isExplicit: track.explicit,
        id: track.id,
        uri: track.uri
        }
    });
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

    return tracks
}


export function getDateSorted(time) {   
    let today = new Date();
    let trackDate = new Date(time);
    let todayDay = today.getDate();
    let trackDateDay = trackDate.getDate();
    let todayYear = today.getFullYear()
    let trackDateYear = trackDate.getFullYear();
    let differ = Math.abs(trackDateDay - todayDay);
    let res;
    if(trackDateYear == todayYear && differ  <= 31) {
        if(differ >= 7) {
          res = "1 week ago"
        }            
        else if(differ >= 14) {
           res = "2 week ago"
        } 
        else if(differ >= 21) {
          res = "3 week ago"
        } 

        else if(differ >= 14 && differ <= 31) {
          res = "4 week ago"
        }
        else {
          res = moment(time).fromNow()
        }
    }

    else {
        res = moment(time).format("MMM D, YYYY");
    }  

    return res
}

export function displayTrackDuration(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}



