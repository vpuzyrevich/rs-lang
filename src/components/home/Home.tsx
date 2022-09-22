import React from "react";
import { useNavigate } from "react-router-dom";
import { MENUITEMS } from "../../common/constants";
import Footer from "../footer/Footer";
import './Home.scss';

export function Home () {
  let navigate = useNavigate();
  return (
    <React.StrictMode>
      <div className="home">
        <div className="home-wrapper">
          <div className="home-content">
            <h1 className="home-title"><span>RS</span><span>L</span><span>a</span><span>n</span><span>g</span></h1>
            <div className="home-description">Повторение - мать учения. Наше приложение превратит изучение английских слов в увлекательный процесс.</div>
            <div className="home-description">Знакомьтесь со словами в Словаре и закрепляйте знания в Играх. Авторизуйтесь, и вы сможете создавать списки сложных слов, вести статистику изучения слов за день и за все время обучения.</div>
            <button className="home-btn" onClick={() => navigate(MENUITEMS[9].link)}>О команде</button>
          </div>
          <div className="home-image"></div>
        </div>
        <Footer />
      </div>
    </React.StrictMode>
  );
}
export default Home;