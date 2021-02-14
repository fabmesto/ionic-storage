import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpsService } from './https.service';
import { StorageService } from './storage.service';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public user_key = '';
  public url_wordpress = '';
  public url_wordpress_user_register = '';

  protected jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(
    protected https: HttpsService,
    protected storage: StorageService,
  ) {
  }

  getUser() {
    const repString: any = localStorage.getItem(this.user_key);
    if (repString) {
      const user: any = JSON.parse(repString);
      if (user) {
        const token = user.token;
        if (token !== '') {
          const jwt = this.jwtHelper.decodeToken(token);
          if (jwt) {
            if (!jwt.exp) {
              return user;
            }
            if (typeof jwt.exp === 'undefined') {
              return user;
            }
            let current_time = Date.now() / 1000;
            if (jwt.exp < current_time) {
              return false;
            } else {
              return user;
            }
          }
        }
      }
    } else {
      // copia eventualemente il contenuto di storage in local
      this.storage.get(this.user_key).then((val) => {
        if (val) {
          localStorage.setItem(this.user_key, val);
        }
      });
    }
    return false;
  }


  setUser(user: any) {
    const decoded: any = this.jwtHelper.decodeToken(user.token);
    user.decoded = decoded;

    this.storage.set(this.user_key, JSON.stringify(user));
    localStorage.setItem(this.user_key, JSON.stringify(user));

    return true;
  }

  doRegister(user_data: any, token: string) {
    let options = this.https.getHeadersToken(token);
    return this.https.post(this.url_wordpress_user_register, user_data, options);
  }

  logOut() {
    this.storage.remove(this.user_key);
    localStorage.removeItem(this.user_key);
    return true;
  }

  doLogin(username: string, password: string) {
    return this.https.post(this.url_wordpress + 'wp-json/jwt-auth/v1/token', {
      username: username,
      password: password
    });
  }

  validateAuthToken(token: string) {
    let options = this.https.getHeadersToken(token);
    return this.https.post(this.url_wordpress
      + 'wp-json/jwt-auth/v1/token/validate?token='
      + token, {}, options)
  }
}
