import React from "react";
import "./Home.css";

function Home() {
  return (
    <div className="home-div">
      <div className="content-container">
        <div className="content">
          <h1 className="home-h1">Welcome to Our Blog App!</h1>
          <p>
            At our blog app, we're committed to fostering a vibrant community
            where diverse topics are explored, engaging content is shared, and
            meaningful connections are made among writers and readers alike.
            Whether you're seeking inspiration, looking to share your voice, or
            simply enjoy discovering new ideas, our platform offers something
            for everyone.
          </p>
          <p>What are you waiting for? Just Register.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
