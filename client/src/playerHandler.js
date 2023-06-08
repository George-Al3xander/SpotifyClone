const AUTHORIZE = "https://accounts.spotify.com/authorize"
const TOKEN = "https://accounts.spotify.com/api/token";
const PLAYLISTS = "https://api.spotify.com/v1/me/playlists";
const DEVICES = "https://api.spotify.com/v1/me/player/devices";
const PLAY = "https://api.spotify.com/v1/me/player/play";
const PAUSE = "https://api.spotify.com/v1/me/player/pause";
const NEXT = "https://api.spotify.com/v1/me/player/next";
const PREVIOUS = "https://api.spotify.com/v1/me/player/previous";
const PLAYER = "https://api.spotify.com/v1/me/player";
const TRACKS = "https://api.spotify.com/v1/playlists/{{PlaylistId}}/tracks";
const CURRENTLYPLAYING = "https://api.spotify.com/v1/me/player/currently-playing";
const SHUFFLE = "https://api.spotify.com/v1/me/player/shuffle";

function callApi(method, url, body, callback){
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xhr.send(body);
    xhr.onload = callback;
}


export function play(deviceId, playlist_id){
    //let playlist_id = document.getElementById("playlists").value;
    //let trackindex = document.getElementById("tracks").value;
    //let album = document.getElementById("album").value;
    let body = {};
    //if ( album.length > 0 ){
        body.context_uri = "album";
  //  }
    //else{
    //    body.context_uri = "spotify:playlist:" + playlist_id;
    //}
    body.offset = {};
   // body.offset.position = trackindex.length > 0 ? Number(trackindex) : 0;
    body.offset.position_ms = 0;
    callApi( "PUT", PLAY + "?device_id=" + deviceId, JSON.stringify(body), handleApiResponse );
}

export function shuffle(deviceId){
    callApi( "PUT", SHUFFLE + "?state=true&device_id=" + deviceId, null, handleApiResponse );
    play(); 
}

export function pause(deviceId){
    callApi( "PUT", PAUSE + "?device_id=" + deviceId, null, handleApiResponse );
}

export function next(deviceId){
    callApi( "POST", NEXT + "?device_id=" + deviceId, null, handleApiResponse );
}

export function previous(deviceId){
    callApi( "POST", PREVIOUS + "?device_id=" + deviceId, null, handleApiResponse );
}

function handleApiResponse(){
    if ( this.status == 200){
        console.log(this.responseText);
        setTimeout(currentlyPlaying, 2000);
    }
    else if ( this.status == 204 ){
        setTimeout(currentlyPlaying, 2000);
    }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }    
}