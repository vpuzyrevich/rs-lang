import { useContext } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import logo from '../../assets/img/rsl-logo.svg';
import { MENUITEMS } from "../../common/constants";
import { API } from "../API/api";
import { authContext } from "../app/App";
import Home from "../home/Home";
import "./approuter.scss";
import "./header.scss";



  
function AppRouter() {
  const {isAuth,changeIsAuth} = useContext(authContext);
    /*const listItems = MENUITEMS.map((item) =>
      <li key={item.value}>
        <Link className="menu__item" to={item.link}> {item.value}</Link>
      </li>
    )*/
    const btnLogIn = (
      <Link className="menu__item menu__auth menu__logout" to={MENUITEMS[1].link}> {MENUITEMS[1].value}</Link>
    );
    const btnLogout = (
      <div className="menu__item menu__auth" onClick={() => {
        API.logout();
        changeIsAuth(false); // NT 2022-08-31        
        }}>
          Выйти
      </div>
    )
    const listItems = [(
      <li key={MENUITEMS[2].value}>
        <Link className="menu__item" to={MENUITEMS[2].link}> {MENUITEMS[2].value}</Link>
      </li> 
    )];
    listItems.push((  
       <li key={MENUITEMS[3].value}>
      <Link className="menu__item" to={MENUITEMS[3].link}> {MENUITEMS[3].value}</Link>
    </li> 
    ));
    if (isAuth) {
      listItems.push((  
      <li key={MENUITEMS[4].value}>
     <Link className="menu__item" to={MENUITEMS[4].link}> {MENUITEMS[4].value}</Link>
   </li> 
   ));
        
      }
    const routeItems = MENUITEMS.map((item) =>
      <Route key={item.value} path={'/' + item.link} element ={item.element}/>
    )
  return (
    <BrowserRouter>
      <header className="header">
        <div className="wrapper header__wrapper">
          <Link to={MENUITEMS[0].link}>
            <img src={logo} className="header__logo" alt="logo" />
          </Link>
          <h5>{isAuth ? btnLogout : btnLogIn}</h5>
        </div>
      </header>
      <div className="menu">
        <ul className="menu__list wrapper">{listItems}</ul>
      </div>
      <section className="content">
        <Routes>
          {routeItems}
        </Routes>
      </section>
    </BrowserRouter>

  );
}

export default AppRouter;
