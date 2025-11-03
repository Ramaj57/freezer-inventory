import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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