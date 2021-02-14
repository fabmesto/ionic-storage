import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root'
})
export class WordpressService {
  
  constructor(
    public https: HttpsService,
    public authentication: AuthenticationService,
  ) { }

  protected _authPost(url, data) {
    const user = this.authentication.getUser();
    let options: any = {};
    if (user) {
      const token = user.token;
      options = this.https.getHeadersToken(token);
    }
    return this.https.post(url, data, options);
  }

  protected _authGet(url) {
    const user = this.authentication.getUser();
    let options: any = {};
    if (user) {
      const token = user.token;
      options = this.https.getHeadersToken(token);
    }
    return this.https.get(url, options);
  }

}