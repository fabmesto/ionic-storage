import { ApiService } from './api.service';
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
    public api: ApiService,
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

  public itunesValidatePurchase(product: any): Observable<any> {
    return this._authPost(
      'url to implement',
      product
    );
  }

  public googleValidatePurchase(product: any): Observable<any> {
    return this._authPost(
      'url to implement',
      product
    );
  }

  protected _authPost(url: string, data: any): Observable<any> {
    const options = this._getUserHeaders();
    return this.https.post(url, data, options);
  }

  protected _authGet(url: string, forceRefresh = false, cacheTime?: number): Observable<any> {
    const options = this._getUserHeaders();
    return this.api.getData(url, forceRefresh, options, {}, cacheTime);
  }

  protected _getUserHeaders() {
    const user = this.authentication.getUser();
    let options = {};
    if (user) {
      const token = user.token;
      options = this.https.getHeadersToken(token);
    }
    return options;
  }

}