import React from "react";
import { Link } from "react-router-dom";
const Home = () => {
    return(
        <div className="home">
            <h1>Home</h1>
            <Link to="/search"> Go to search</Link>
        </div>
    )
}

export default Home