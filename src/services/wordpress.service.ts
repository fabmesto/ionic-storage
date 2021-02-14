import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  public getUserSettings(): Observable<any> {
    return this._authGet(
      'url to implement'
    );
  }
  
  public saveUserSettings(data: any): Observable<any> {
    return this._authPost(
      'url to implement',
      data
    );
  }

  public itunesValidatePurchase(product): Observable<any> {
    return this._authPost(
      'url to implement',
      product
    );
  }

  public googleValidatePurchase(product): Observable<any> {
    return this._authPost(
      'url to implement',
      product
    );
  }

  protected _authPost(url, data): Observable<any> {
    const user = this.authentication.getUser();
    let options: any = {};
    if (user) {
      const token = user.token;
      options = this.https.getHeadersToken(token);
    }
    return this.https.post(url, data, options);
  }

  protected _authGet(url): Observable<any> {
    const user = this.authentication.getUser();
    let options: any = {};
    if (user) {
      const token = user.token;
      options = this.https.getHeadersToken(token);
    }
    return this.https.get(url, options);
  }

}