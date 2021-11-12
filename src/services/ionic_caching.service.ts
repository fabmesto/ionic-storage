import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver'

@Injectable({
    providedIn: 'root'
})
export class IonicCachingService {
    // Expire time in seconds
    public defaulCacheTime = 60 * 60;
    public CACHE_KEY = '_cached_';

    constructor(
        private storage: Storage
    ) { }

    // Setup Ionic Storage
    async initStorage() {
        await this.storage.defineDriver(CordovaSQLiteDriver);
        await this.storage.create();
    }

    // Store request data
    cacheRequest(url, data, cacheTime?: number): Promise<any> {
        if (!cacheTime) {
            cacheTime = this.defaulCacheTime;
        }
        const validUntil = (new Date().getTime()) + cacheTime * 1000;
        url = `${this.CACHE_KEY}${url}`;
        return this.storage.set(url, { validUntil, data });
    }

    // Try to load cached data
    async getCachedRequest(url): Promise<any> {
        const currentTime = new Date().getTime();
        url = `${this.CACHE_KEY}${url}`;

        const storedValue = await this.storage.get(url);

        if (!storedValue) {
            return null;
        } else if (storedValue.validUntil < currentTime) {
            await this.storage.remove(url);
            return null;
        } else {
            return storedValue.data;
        }
    }

    // Remove all cached data & files
    async clearCachedData() {
        const keys = await this.storage.keys();

        keys.map(async key => {
            if (key.startsWith(this.CACHE_KEY)) {
                await this.storage.remove(key);
            }
        });
    }

    // Example to remove one cached URL
    async invalidateCacheEntry(url) {
        url = `${this.CACHE_KEY}${url}`;
        await this.storage.remove(url);
    }

    async invalidateCacheForAllUrlStartsWith(url) {
        url = `${this.CACHE_KEY}${url}`;
        let keys = await this.storage.keys();

        keys.map(async key => {
            if (key.startsWith(url)) {
                await this.storage.remove(key);
            }
        });
    }
}