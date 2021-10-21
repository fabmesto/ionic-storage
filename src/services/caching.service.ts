import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';



@Injectable({
    providedIn: 'root'
})
export class CachingService {
    // Expire time in seconds
    public defaulCacheTime = 60 * 60;
    public CACHE_KEY = '_cached_';

    constructor(
        private storage: StorageService
    ) { }

    // Setup Ionic Storage
    async initStorage() {
        await this.storage.migrate();
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

        const storedString = await this.storage.get(url);
        if (storedString) {

            const storedValue = JSON.parse(storedString);

            if (!storedValue) {
                return null;
            } else if (storedValue.validUntil < currentTime) {
                await this.storage.remove(url);
                return null;
            } else {
                return storedValue.data;
            }
        } else {
            return null;
        }
    }

    // Remove all cached data & files
    async clearCachedData() {
        this.storage.removes(this.CACHE_KEY);
    }

    // Example to remove one cached URL
    async invalidateCacheEntry(url) {
        url = `${this.CACHE_KEY}${url}`;
        await this.storage.remove(url);
    }

    async invalidateCacheForAllUrlStartsWith(url) {
        url = `${this.CACHE_KEY}${url}`;
        await this.storage.removes(url);
    }
}