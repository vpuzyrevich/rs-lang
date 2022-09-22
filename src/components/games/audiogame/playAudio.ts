import { API } from '../../API/api';

const playAudio = (sound: string, setState: React.Dispatch<React.SetStateAction<boolean>>) => {
  let audio = new Audio();
  audio.src = `${API.baseUrl}/${sound}`;
  audio.play().catch((err) => {
    console.log(err);
  });
  audio.onended = () => { 
    audio.pause();
    setState(false);
    audio.currentTime = 0;
  }
}
export default playAudio