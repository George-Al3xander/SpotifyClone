import React from "react";
let redirect_uri = "http://localhost:3000"
const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=a104992a9a514f2cb04a886f8570f16e&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20playlist-read-private%20playlist-read-collaborative%20playlist-modify-private%20playlist-modify-public"


 const Login = () => {
    return (
        <div>
         <a href={AUTH_URL}>Login to Spotify</a>  
        </div>
    )
}


export default Login