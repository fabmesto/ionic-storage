import { WordpressService } from './wordpress.service';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  keyTime = '_t';
  defaulCacheTime = 60 * 5;

  constructor(
    public storage: StorageService,
    public wordpress: WordpressService,
  ) {
  }

  async setLocal(key: string, value: any, saveTimestamp = true): Promise<void> {
    if (saveTimestamp) {
      this.storage.set(key + this.keyTime, this.timestampInSeconds());
    }
    return this.storage.set(key, value);
  }

  async getLocal(key: string): Promise<string> {
    return await this.storage.get(key);
  }

  async isValidKey(key: string, cacheTime?: number): Promise<boolean> {
    const time = await this.storage.get(key + this.keyTime);
    if (time && this.isValidTime(time, cacheTime)) {
      return true;
    }
    // console.log('notValidKey', key, time);
    return false;
  }

  isValidTime(timeString, cacheTime?: number): boolean {
    if (!cacheTime) {
      cacheTime = this.defaulCacheTime;
    }
    const time: number = +timeString;
    const now = this.timestampInSeconds();
    if ((now - time) <= cacheTime) {
      return true;
    }
    return false;
  }

  async invalidKey(key: string): Promise<void> {
    return this.storage.set(key + this.keyTime, 0);
  }

  timestampInSeconds(): number {
    return Math.floor(Date.now() / 1000);
  }

  bytesToSize(bytes: number) {
    const sizes: any = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';

    let i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
  }

  async getDarkMode(): Promise<boolean> {
    const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const local: string = await this.getLocal('darkMode');
    if (local) {
      return (local === 'true');
    }
    return darkMode;
  }

  setDarkMode(darkMode: boolean) {
    this.setLocal('darkMode', darkMode);
    document.body.classList.toggle('dark', darkMode);
  }

  async startDarkMode(): Promise<void> {
    const darkMode = await this.getDarkMode();
    document.body.classList.toggle('dark', darkMode);
  }
}
