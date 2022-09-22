import { UserData } from './userData';
import { BASELINK, ERROR, RESERVE_TIME } from "../../common/constants";
import { IAggrResp, IGetUserStats, IUser, IUserSignin, IUserStats, IUserToken, IUserWord,  IUserWordOptions, IUserWordRecord, IWord } from "../../common/interfaces";


const enum METHODS {
  get = "GET",
  post = "POST",
  delete = "DELETE",
  put = "PUT"
}
const enum ENDPOINTS {
  words = "words",
  users = "users",
  signin = "signin",
  tokens = "tokens",
  aggwords = "aggregatedWords",
  statistics = "statistics"
}

export class API {

  static baseUrl = BASELINK;
  private static userToken = "";
  private static userId = "";
  private static refreshToken ="";

  static init(){
    if (localStorage.getItem('userData')) {
    
      API.loadAuthData(JSON.parse(localStorage.getItem('userData') as string));
      if (API.isTokenExpired()) {
        
        API.logout();
        return false;
      } else {
        
        return true;
      }
    }
    return false;
  }

 static isTokenExpired(){
  return API.isExpired(API.getExpirationDateToken(API.userToken))
  }
 

  static isAuth(){
    return !!API.userId;
  }

  static loadAuthData(token: IUserSignin){
    API.userToken = token.token;
    API.userId = token.userId;
    API.refreshToken = token.refreshToken;
   
  }

  static signOut(){
    API.userToken = "";
    API.userId = "";
    API.refreshToken = "";
  
  }

  static logout(): void  {    
    localStorage.removeItem('userData');
    API.signOut();
    localStorage.removeItem('isAuth');
  }

/**
 * return all words from page and group
 * @getWords
 * @param {number} page - page
 * @param {number} group - group
 * @returns {Promise<IWord[]>} array of words
 */
  static async getWords(page?: number, group?: number) {
    if (page === undefined) page = 0;
    if (group === undefined) group = 0;

    return fetch(`${API.baseUrl}/${ENDPOINTS.words}?page=${page}&group=${group}`)
      .then((res) => res.json())
      .then((data) => data as IWord[]);
    
  }
/**
 * return word
 * @getWordById
 * @param {string} wordId - word id
 * @returns {Promise<IWord>} word
 */
  static async getWordById(id: string) {   
    return fetch(`${API.baseUrl}/${ENDPOINTS.words}/${id}`)
      .then((res) => res.json())
      .then((data) => data as IWord);    
  }
/**
 * create user
 * @createUser
 * @param {string} email - user email
 * @param {string} password - user password
 * @returns {Promise<IUser>} user info
 */

  static createUserAndLogin(email:string, password: string){
    return API.createUser(email,password)
    .then(() => API.signIn(email, password))
    .then(()=> API.setUserStats({
        learnedWords: 0,
        optional: {
          daystats:
          {
            date: "",
            gamestats:[],
            wordsstats: {
              learnedWords: 0,
              newWords: 0
            }
          },
          longstats:
          {
            longStatsArray:[]
          },
        }
      } as IUserStats))         
      .then(() => {})  
      .catch((err: Error) =>{
        if(err.message.includes(ERROR.already_exist)) throw new Error("Такой пользователь уже зарегстрирован");
        if(err.message.includes(ERROR.forbidden)) throw new Error("Неверный логин или пароль");
        if(err.message.includes(ERROR.notfound)) throw new Error("Такой пользователь не найден");
        
      })
  }


  private static async createUser(email:string, password: string) {    
    return fetch(
      `${API.baseUrl}/${ENDPOINTS.users}`,
      {
        method: METHODS.post,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: email, password: password }) 
      })
      .then((res) => API.errorHandler(res))  // 
      .then((res) => res.json())
      .then((data) => data as IUser) 
      .catch((err: Error) => {throw new Error(err.message)});
  }
  static logIn(email:string, password: string){
    return API.signIn(email,password)   
      .catch((err: Error) =>{       
        if(err.message.includes(ERROR.forbidden)) throw new Error("Неверный логин или пароль");
        if(err.message.includes(ERROR.notfound)) throw new Error("Такой пользователь не найден");
        throw new Error("Ошибка авторизации")
      })
  }

  /**
 * sign in
 * @signIn
 * @param {string} email - user email
 * @param {string} password - user password
 * @returns {Promise<IUserToken>} user info
 */
  private static async signIn(email:string, password: string){
    return fetch(
      `${API.baseUrl}/${ENDPOINTS.signin}`,
      {
        method: METHODS.post,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: email, password: password }) 
      })
      .then((res) => API.errorHandler(res))  // 403 forbidden if other user or other token
      .then((res) => res.json())
      .then((data) => data as IUserSignin)
      .then((data) => {API.saveToken(data);  return data;})
      .catch((err: Error) => {throw new Error(err.message)});
  }

  

  /**
 * get token
 * @getToken
 * @returns {Promise<IUserToken>} user info
 */
  static async getToken() {
    return fetch(`${API.baseUrl}/${ENDPOINTS.users}/${API.userId}/${ENDPOINTS.tokens}`,
    {
      method: METHODS.get,
      headers: {
        'Authorization': `Bearer ${API.refreshToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((res) => API.errorHandler(res))  // 403 forbidden if other user or other token
    .then((res) => res.json())
    .then((data) => data as IUserToken)
    .then((data) => {API.saveRefreshToken(data);  return data;})
    .catch((err: Error) => {throw new Error(err.message)});
}

// authorized requests
/** 
* get user
* @getUser
* @returns {Promise<IUser>} user info
*/
// authorized! getUser(id: string) => Promise<IUser>
  static async getUser() {   
    return API.authFetch(`${API.baseUrl}/${ENDPOINTS.users}/${API.userId}`)
      .then((res) => API.errorHandler(res))  // 403 forbidden if other user or other token
      .then((res) => res.json())
      .then((data) => data as IUser)   // {id: string, email: string}
      .catch((err: Error) => {throw new Error(err.message)});   
  }

  /**
   * update User
   * @updateUser
   * @param {string} email - user email
   * @param {string} password - user password
   * @returns {Promise<IUser>} user info
   */ 
  static async updateUser(email:string, password: string) {
    return API.authFetch(
      `${API.baseUrl}/${ENDPOINTS.users}/${API.userId}`,
      {
        method: METHODS.put,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password }) 
      })
      .then((res) => API.errorHandler(res))  // 403 forbidden if other user or other token
      .then((res) => res.json())
      .then((data) => data as IUser)  // {id: string, email: string}
      .catch((err: Error) => {throw new Error(err.message)});
  }

  /**
   * getUserWords
   * @getUserWords
   * @returns {Promise<IUserWord[]>} array of words with info
   */ 
  static async getUserWords() {
    return API.authFetch(`${API.baseUrl}/${ENDPOINTS.users}/${API.userId}/${ENDPOINTS.words}`)
      .then((res) => API.errorHandler(res))  // 403 forbidden if other user or other token
      .then((res) => res.json())
      .then((data) => data as IUserWordRecord[])
      .catch((err: Error) => {throw new Error(err.message)});
  }

    /**
   * getUserWord
   * @getUserWords
   * @returns {Promise<IUserWordRecord>}  wordID with info
   */ 
     static async getUserWord(wordId: string) {
      return API.authFetch(`${API.baseUrl}/${ENDPOINTS.users}/${API.userId}/${ENDPOINTS.words}/${wordId}`)
        .then((res) => API.errorHandler(res))  // 403 forbidden if other user or other token
        .then((res) => res.json())
        .then((data) => data as IUserWordRecord)
        .catch((err: Error) => {throw new Error(err.message)});
    }

   /**
   * getAggregatedUserWords
   * @getAggregatedUserWords
   * @returns {Promise<IUserWord[]>} array of words with info
   */ 
    static async getAggregatedUserWords(group?: number,page?: number, wordsPerPage?:number,filter?: string) {
      let link = `${API.baseUrl}/${ENDPOINTS.users}/${API.userId}/${ENDPOINTS.aggwords}?`;      
      if(group !== undefined) link += `group=${group}&`;
      if(page !== undefined) link += `page=${page}&`;
      if(wordsPerPage!== undefined) link += `wordsPerPage=${wordsPerPage}&`;
      if(filter !== undefined)link += `filter=${filter}&`;
      link = link.slice(0,-1);
      return API.authFetch(link)
        .then((res) => API.errorHandler(res))  // 403 forbidden if other user or other token
        .then((res) => res.json())
        .then((data:IAggrResp[]) => { return data[0].paginatedResults as IUserWord[]})
        .catch((err: Error) => {throw new Error(err.message)});
    }
 /**
   * create UserWord
   * @createUserWord
   * @param {string} wordId - word ID
   * @param {IUserWordOptions} - wordOptions
   * @returns {Promise<IUserWordRecord>} user info
   */ 
  static async createUserWord(wordId: string, wordOptions: IUserWordOptions) {    
    return API.authFetch(
      `${API.baseUrl}/${ENDPOINTS.users}/${API.userId}/${ENDPOINTS.words}/${wordId}`,
      {
        method: METHODS.post,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(wordOptions) 
      })
      .then((res) => API.errorHandler(res))  // 
      .then((res) => res.json())
      .then((data) => data as IUserWordRecord)
      .catch((err: Error) => {throw new Error(err.message)}); //Error 417: such user word already exists
  }

static async updateUserWord(wordId: string, wordOptions: IUserWordOptions) {
  return API.authFetch(
      `${API.baseUrl}/${ENDPOINTS.users}/${API.userId}/${ENDPOINTS.words}/${wordId}`,
      {
          method: METHODS.put,
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(wordOptions)
      })
      .then((res) => API.errorHandler(res))  //
      .then((res) => res.json())
      .then((data) => data as IUserWord)
      .catch((err: Error) => {throw new Error(err.message)}); //Error 417: such user word already exists
}
   /**
   * delete UserWord
   * @deleteUserWord
   * @param {string} wordId - word ID
   */ 
static deleteUserWord(wordId: string) {    
    return API.authFetch(
      `${API.baseUrl}/${ENDPOINTS.users}/${API.userId}/${ENDPOINTS.words}/${wordId}`,
      {
        method: METHODS.delete,        
      })
      .then((res) => API.errorHandler(res))  
      .then(()=> {})
      .catch((err: Error) => {throw new Error(err.message)}); //Error 
}


  /**
 * getUserStats
 * @getUserStats
 * @returns {Promise<IUserStats>}  wordID with info
 */
  static getUserStats() {
    return API.authFetch(`${API.baseUrl}/${ENDPOINTS.users}/${API.userId}/${ENDPOINTS.statistics}`)
      .then((res) => API.errorHandler(res))  // 403 forbidden if other user or other token
      .then((res) => res.json())
      .then(({ id, ...rest }: IGetUserStats) => { const tmpid = id; const data: IUserStats = rest; return data})
      .catch((err: Error) => { throw new Error(err.message) });
  }


  static setUserStats(userStats: IUserStats){
    return API.authFetch(`${API.baseUrl}/${ENDPOINTS.users}/${API.userId}/${ENDPOINTS.statistics}`,
    {
        method: METHODS.put,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userStats),
       
    })
    .then((res) => API.errorHandler(res))  //
    .then((res) => res.json())
    .then((data) => data as IUserStats)
    .catch((err: Error) => {throw new Error(err.message)}); 
  }






// https://www.codementor.io/@obabichev/react-token-auth-12os8txqo1
// args of fetch api are typed in typescrypt
  private static async authFetch(input: RequestInfo, init?: RequestInit) {
   
    init = init || {};

    init.headers = {
        ...init.headers,
        Authorization: `Bearer ${API.userToken}`,
    };

    return fetch(input, init);
  };

 

  private static errorHandler(res: Response) {
    const status = res.status.toString();
    if(res.ok) return res;
    if(status === ERROR.unauthorized || status === ERROR.forbidden) API.logout();
    return res.text()
      .then((data) => {throw new Error(`Error ${status}: ${data}`)})   
  }

  private static saveToken(token:IUserSignin){
    API.userToken = token.token;
    API.userId = token.userId;
    API.refreshToken = token.refreshToken;
  }

  private static saveRefreshToken(token:IUserToken){
    API.userToken = token.token;
    API.refreshToken = token.refreshToken;
  }

  static getExpirationDateToken (token?: string): number | null {
    if (!token) {
      return null;
    }
    const jwt = JSON.parse(atob(token.split('.')[1]));
    return (jwt && jwt.exp && jwt.exp * 1000) || null;
  }

  static isExpired(exp?: number | null): boolean {
    if (!exp) {
      return false;
    }
    return Date.now() > (exp - RESERVE_TIME);
  }

  static async getRefreshToken (): Promise<null | undefined> {
    const userData = new UserData();
    
    if(!API.userToken) {
      return null;
    }
   
    if (API.isExpired(API.getExpirationDateToken(API.userToken))) {
      userData.setAuth(false);
      localStorage.removeItem('isAuth');
      await API.getToken().then((resp) => {
        userData.user.token = resp.token;
        userData.user.refreshToken = resp.refreshToken;
        API.userToken = resp.token;
        API.refreshToken = resp.refreshToken;
        localStorage.setItem('userData', JSON.stringify(userData.user));
        localStorage.setItem('isAuth', 'true');
        userData.setAuth(true);
      }).catch((e) => console.log(e));
    }
  }
}