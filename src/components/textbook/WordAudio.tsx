import React, { useState } from 'react'
import icon from './assets/volume-up-interface-symbol_icon-icons.com_73337.svg';
import playAudios from './playAudios';

interface linkProps {
  audioLink: string
  audioMeaningLink: string
  audioExampleLink: string
}


function WordAudio(props: linkProps) {
  const [isPlaying, setPlaying] = useState(false);
  const { audioLink , audioMeaningLink, audioExampleLink } = props;
  const sounds = [audioLink, audioMeaningLink, audioExampleLink]; 
  return (
    <div>
      <div onClick={() => {
        if (!isPlaying) {
          setPlaying(!isPlaying); 
          playAudios(sounds, setPlaying);
        }
        }}> <img className="sound-icon" alt={'play sound'} src={ icon }/> </div>
  </div>
  )
}

export default WordAudio