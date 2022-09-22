import { IUserSignin } from '../../common/interfaces';

export class UserData {
  user: IUserSignin;
  isAuth: boolean;

  constructor() {
    this.user = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData') as string) : {};
    this.isAuth = localStorage.getItem('isAuth') ? !!JSON.parse(localStorage.getItem('isAuth') as string) : false;
  }

  setUser (user: IUserSignin): void {
    this.user = user;
  }
  setAuth (bool: boolean): void {
    this.isAuth = bool;
  }
}