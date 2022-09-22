import { API } from '../API/api';

const playAudios = (sounds: string[], setState: React.Dispatch<React.SetStateAction<boolean>>) => {
  let index = 0;
  let audio = new Audio();
  audio.src = `${API.baseUrl}/${sounds[index]}`;
  audio.play().catch((err) => {
    console.log(err);
  });
  audio.onended = () => { 
  index += 1;
  if (index < sounds.length && sounds[1] !== undefined) {
    audio.src = `${API.baseUrl}/${sounds[index]}`;
    audio.play().catch((err) => {
      console.log(err);
    });
  } else {
    audio.pause();
    setState(false);
    audio.currentTime = 0;
  }
}
}
export default playAudios