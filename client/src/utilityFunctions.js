export function msToTime(tracks) {
    let duration = tracks.reduce((prev,curr) => {                 
        return  prev + curr.track.duration_ms            
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






