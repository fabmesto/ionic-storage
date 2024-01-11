import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap, timeout } from 'rxjs/operators';
import { from, Observable, of, throwError } from 'rxjs';
import { Http } from '@capacitor-community/http';

@Injectable({
  providedIn: 'root'
})
export class HttpsService {
  protected usePlugin = true;
  protected useNoCache = true;
  protected urltimeout = 25000;

  constructor(
    protected angularHttp: HttpClient,
    protected platform: Platform,
  ) {
    // this.usePlugin = this.platform.is('ios');
  }

  errorMsg = '';

  public setUsePlugin(value: boolean) {
    this.usePlugin = value;
  }

  public getHeadersNoCache(options: any = {}) {
    if (this.usePlugin) {
      return this.getHeadersNoCachePlugin(options);
    } else {
      return this.getHeadersNoCacheAngular(options);
    }
  }

  getHeadersNoCacheAngular(options: any = {}) {
    if (!('headers' in options)) {
      options.headers = {};
    }

    options.headers['Cache-control'] = 'no-cache';
    options.headers['Expires'] = '0';
    // options.headers['Pragma'] = 'no-cache';

    return options;
  }

  getHeadersNoCachePlugin(headers: any = {}) {
    headers['Cache-control'] = 'no-cache';
    headers['Expires'] = '0';
    return headers;
  }

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

  public get(url: string, headers = {}, params = {}): Observable<any> {
    if (this.useNoCache) {
      headers = this.getHeadersNoCache(headers);
    }
    if (this.usePlugin) {
      return this.getPlugin(url, headers, params);
    } else {

      return this.getAngular(url, headers);
    }
  }

  protected getPlugin(url: string, headers = {}, params = {}): Observable<any> {
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
        if (all.status >= 200 && all.status < 300) {
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

  protected getAngular(url: string, options = {}): Observable<any> {

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

  public post(url: string, data = {}, headers = {}): Observable<any> {
    if (this.usePlugin) {
      return this.postPlugin(url, data, headers);
    } else {
      return this.postAngular(url, data, headers);
    }
  }

  protected postPlugin(url: string, data = {}, headers: any = {}): Observable<any> {
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
        if (all.status >= 200 && all.status < 300) {
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

  protected postAngular(url: string, data: any, options = {}): Observable<any> {
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

  public upload(url: string, data: any, headers: any): Observable<any> {
    if (this.usePlugin) {
      return this.uploadPlugin(url, data, headers);
    } else {
      return this.postAngular(url, data, headers);
    }
  }

  uploadPlugin(url: string, data: any, headers: {}): Observable<any> {
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
        if (all.status >= 200 && all.status < 300) {
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
