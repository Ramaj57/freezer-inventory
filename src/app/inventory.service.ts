import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Item } from './item';

const storageKey = 'freezer-inventory-items';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private items$:BehaviorSubject<Item[]>;

  constructor() {
    const savedItems = localStorage.getItem(storageKey);
    this.items$ = new BehaviorSubject<Item[]>(savedItems ? JSON.parse(savedItems) : []);
  }
  getAll() {
    return this.items$.asObservable();
  }
  snapshot() {
    return this.items$.value;
  }

  saveAll(items: Item[]) {
    localStorage.setItem(storageKey, JSON.stringify(items));
    this.items$.next(items);
  }

  addItem(item: Item) {
    const items = [...this.items$.value, item];
    this.saveAll(items);
  }

  updateItem(updatedItem: Item) {
    const items = this.items$.value.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    this.saveAll(items);
  }


}




async function lookupExternal(barcode: string): Promise<any|null> {
  // Example UPCitemdb (replace KEY with your API key)
  const key = 'YOUR_API_KEY';
  const url = `https://api.upcitemdb.com/prod/trial/lookup?upc=${encodeURIComponent(barcode)}`;
  // or a real key endpoint requiring the header/api key
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' /* add API key header if needed */ }
    });
    if (!res.ok) {
      console.warn('Lookup failed', res.status);
      return null;
    }
    const data = await res.json();
    // Parse the result depending on the API
    return data;
  } catch (e) {
    console.error('Lookup error', e);
    return null;
  }
}
  
