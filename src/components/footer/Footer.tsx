import React from "react";
import "./footer.scss";

class Footer extends React.Component{
    render() {
      return (
        <React.StrictMode>
          <footer className="footer">
            <div className="wrapper footer__wrapper">
              <a 
                className="footer__logo" 
                href="https://rs.school/js/" 
                target="_blank"
                rel="noopener noreferrer">            
              </a>
              <p>2022</p>
              <div className="footer__team">
                <a className="git-nickname"
                    href="https://github.com/pupixipup" 
                    target="_blank"
                    rel="noopener noreferrer">pupixipup</a>
                <a className="git-nickname"
                    href="https://github.com/BlueOwll" 
                    target="_blank"
                    rel="noopener noreferrer">BlueOwll</a>
               <a className="git-nickname"
                    href="https://github.com/vpuzyrevich" 
                    target="_blank"
                    rel="noopener noreferrer">vpuzyrevich</a>
                
              </div>
            </div>
          </footer>
        </React.StrictMode>
      );
    }
  }
  export default Footer;