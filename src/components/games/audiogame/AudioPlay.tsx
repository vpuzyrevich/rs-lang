import React, { useState } from 'react'
import icon from '../../../../src/assets/icon/sound.svg';
import playAudio from './playAudio';

interface linkProps {
  audioLink: string
}

function WordAudio(props: linkProps) {
  const [isPlaying, setPlaying] = useState(false);
  const { audioLink } = props; 
  return (
    <div>
      <div onClick={() => {
        if (!isPlaying) {
          setPlaying(!isPlaying); 
          playAudio(audioLink, setPlaying);
        }
        }}> <img className="audiogame__audio-icon" alt={'play sound'} src={ icon }/> </div>
  </div>
  )
}

export default WordAudio