import '../../style/normalize.scss';
import "./app.scss";
import { createContext, useEffect, useState } from 'react';
import { API } from '../API/api';
import AppRouter from '../approuter/Approuter';



export const authContext = createContext(
  {
    isAuth: false,
    changeIsAuth: (val: boolean) => {}
  });


function App () {
  const [isAuth, setIsAuth] = useState(() => {
    return API.init();
  });


 
  if (isAuth !== API.isAuth()) setIsAuth(API.isAuth);
  
  const changeIsAuth = (val:boolean) => {
    setIsAuth(val);
  }
  const value = {isAuth,changeIsAuth};

  return (
    <authContext.Provider value={value}>
      <div className="App">      
          <AppRouter />     
      </div>
    </authContext.Provider>
  );
}


export default App;
