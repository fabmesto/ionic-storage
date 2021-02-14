import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap, timeout } from 'rxjs/operators';
import { from, of, throwError } from 'rxjs';

import '@capacitor-community/http';
import { Plugins } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class HttpsService {
  protected usePlugin = false;
  protected urltimeout = 25000;

  constructor(
    protected angularHttp: HttpClient,
    protected platform: Platform,
  ) {
    // this.usePlugin = this.platform.is('ios');
  }

  errorMsg = '';

  public getHeadersToken(token: string = '') {
    if (this.usePlugin) {
      return this.getHeadersTokenPlugin(token);
    } else {
      return this.getHeadersTokenAngular(token);
    }
  }

  protected getHeadersTokenAngular(token: string = '') {
    let options: any = {};
    if (token !== '') {
      options = {
        'headers': { 'Authorization': 'Bearer ' + token }
      };
    }
    return options;
  }

  protected getHeadersTokenPlugin(token: string = '') {
    let headers: any = {};
    if (token !== '') {
      headers = { 'Authorization': 'Bearer ' + token };
    }
    return headers;
  }

  public get(url, headers = {}, params = {}) {
    if (this.usePlugin) {
      return this.getPlugin(url, headers, params);
    } else {
      return this.getAngular(url, headers);
    }
  }

  protected getPlugin(url, headers = {}, params = {}) {
    const { Http } = Plugins;

    const promise = Http.request({
      method: 'GET',
      url,
      headers,
      params
    });

    const observable = from(promise);
    return observable.pipe(
      timeout(this.urltimeout),
      switchMap((all: any) => {
        if (all.status === 200) {
          if (all.data) {
            return of(all.data);
          } else {
            return of(all);
          }
        } else {
          console.log('http get error', all);
          return throwError({ error: all.data });
        }
      }),
      catchError(error => {
        if (error.error instanceof ErrorEvent) {
          this.errorMsg = `Error: ${error.error.message}`;
        } else {
          this.errorMsg = this.getServerErrorMessage(error);
        }
        console.log(this.errorMsg);
        // this.toast.show(this.errorMsg);
        return throwError(error);
        // return of([]);
      })
    );
  }

  protected getAngular(url, options = {}) {

    return this.angularHttp.get(url, options).pipe(
      timeout(this.urltimeout),
      catchError(error => {
        if (error.error instanceof ErrorEvent) {
          this.errorMsg = `Error: ${error.error.message}`;
        } else {
          this.errorMsg = this.getServerErrorMessage(error);
        }
        console.log(this.errorMsg);
        // this.toast.show(this.errorMsg);
        return throwError(error);
        // return of([]);
      })
    );
  }

  public post(url, data = {}, headers = {}) {
    if (this.usePlugin) {
      return this.postPlugin(url, data, headers);
    } else {
      return this.postAngular(url, data, headers);
    }
  }

  protected postPlugin(url, data = {}, headers = {}) {
    const { Http } = Plugins;

    headers['Content-Type'] = 'application/json';

    const promise = Http.request({
      method: 'POST',
      url,
      headers,
      data
    });

    const observable = from(promise);
    return observable.pipe(
      timeout(this.urltimeout),
      switchMap((all: any) => {
        if (all.status === 200) {
          if (all.data) {
            return of(all.data);
          } else {
            return of(all);
          }
        } else {
          console.log('http post error', all);
          return throwError({ error: all.data });
        }
      }),
      catchError(error => {
        if (error.error instanceof ErrorEvent) {
          this.errorMsg = `Error: ${error.error.message}`;
        } else {
          this.errorMsg = this.getServerErrorMessage(error);
        }
        console.log(this.errorMsg);
        // this.toast.show(this.errorMsg);
        return throwError(error);
        // return of([]);
      })
    );
  }

  protected postAngular(url, data, options = {}) {
    return this.angularHttp.post(url, data, options).pipe(
      timeout(this.urltimeout),
      catchError(error => {
        if (error.error instanceof ErrorEvent) {
          this.errorMsg = `Error: ${error.error.message}`;
        } else {
          this.errorMsg = this.getServerErrorMessage(error);
        }
        console.log(this.errorMsg);
        // this.toast.show(this.errorMsg);
        return throwError(error);
        // return of([]);
      })
    );
  }

  public upload(url: string, data, headers) {
    return this.post(url, data, headers);
  }

  protected getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 404: {
        return `Not Found: ${error.message}`;
      }
      case 403: {
        return `Access Denied: ${error.message}`;
      }
      case 500: {
        return `Internal Server Error: ${error.message}`;
      }
      default: {
        return `Unknown Server Error: ${error.message}`;
      }

    }
  }
}
