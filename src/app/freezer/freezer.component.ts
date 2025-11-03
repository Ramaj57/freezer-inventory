import { Component, inject } from '@angular/core';
import { InventoryService } from '../inventory.service';
import { Item } from '../item';

@Component({
  selector: 'app-freezer',
  imports: [],
  templateUrl: './freezer.component.html',
  styleUrl: './freezer.component.css',
})
export class FreezerComponent {
  shelves = Array.from({ length: 10 });
  itemsByShelf: { [idx: number]: { left: Item[]; right: Item[] } } = {};
  private inventory = inject(InventoryService);

  ngOnInit() {
    this.inventory.getAll().subscribe((list) => this.mapItems(list));
    this.mapItems(this.inventory.snapshot());
  }

  private mapItems(list: Item[]) {
    const map: any = {};
    this.shelves.forEach((_, i) => (map[i] = { left: [], right: [] }));
    list.forEach((item) => {
      const idx = item.shelfIndex ?? 0;
      const side = item.side ?? 'left';
      if (!map[idx]) map[idx] = { left: [], right: [] };
      map[idx][side].push(item);
    });
    this.itemsByShelf = map;
  }
}
