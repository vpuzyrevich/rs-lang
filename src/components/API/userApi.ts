import { IUserSignin } from "../../common/interfaces";
import { API } from "./api";
import { UserData } from "./userData";

export class UserApi {
  user: UserData;

  constructor() {
    this.user = new UserData();
  }

  async registerUser(email: string, password: string): Promise<void> {
    return API.createUserAndLogin(email, password).catch((e) => {throw new Error(e.message)});    
  }
  async login(email: string, password: string): Promise<void>  {
      await API.logIn(email, password).then((data) => {
        localStorage.setItem('userData', JSON.stringify(data));
        this.user.setUser(data);
        this.user.setAuth(true);
        localStorage.setItem('isAuth', 'true');
      }).catch((e) => {throw new Error(e.message)});
  }


}