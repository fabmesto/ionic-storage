import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(

  ) { }

  async set(key: string, value: any): Promise<void> {
    const { Storage } = Plugins;
    if (typeof value != 'string') {
      value = JSON.stringify(value);
    }
    await Storage.set({
      key: key,
      value: value
    });
  }

  async get(key: string): Promise<string> {
    const { Storage } = Plugins;
    const item = await Storage.get({ key: key });
    return item.value;
  }

  async remove(key: string): Promise<void> {
    const { Storage } = Plugins;
    await Storage.remove({
      key: key
    });
  }

  async removes(startkey: string): Promise<void> {
    const { Storage } = Plugins;
    let keys = await this.keys();
    for (let key in keys) {
      if (key.startsWith(startkey)) {
        this.remove(key);
      }
    }
  }

  async clear(): Promise<void> {
    const { Storage } = Plugins;
    await Storage.clear();
  }

  async keys(): Promise<{ keys: string[] }> {
    const { Storage } = Plugins;
    return await Storage.keys();
  }
}
