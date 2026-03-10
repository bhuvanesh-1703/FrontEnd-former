import React from "react";
import Banners from "./Banners";
import Category from "./Category";
import Showcase from "./RecentlyAdd";
import Newsletter from "./Newsletter";

const Home = () => {
  return (
    <div>
      <div className="home-page">
        <Banners />
        <Category />
        <Showcase />
        <Newsletter />
      </div>
    </div>
  );
};

export default Home;
