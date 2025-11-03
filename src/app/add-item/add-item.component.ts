import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryService } from '../inventory.service';
// Use the Web Crypto API for UUID generation (no external dependency)

@Component({
  selector: 'app-add-item',
  imports: [FormsModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css'],
})
export class AddItemComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  f = this.fb.group({
    barcode: [''],
    name: ['', Validators.required],
    shelfIndex: [0, Validators.min(0)],
    side: ['left'],
  });

  constructor(private inventory: InventoryService, private router: Router) {}

  ngOnInit() {
    const barcode = this.route.snapshot.queryParamMap.get('barcode');
    if (barcode) {
      this.f.patchValue({ barcode });
    }
  }

  save() {
    const val = this.f.value;
    // const item = {
    //   id: uuidv4(),
    //   name: val.name || undefined,
    //   barcode: val.barcode || undefined,
    //   frozenDate: new Date().toISOString(),
    //   shelfIndex: val.shelfIndex || undefined,
    //   side: val.side || undefined
    // };
    this.inventory.addItem({
      id: uuidv4(),
      name: val.name || undefined,
      barcode: val.barcode || undefined,
      frozenDate: new Date().toISOString(),
      shelfIndex: val.shelfIndex || undefined,
      side: val.side === 'left' || val.side === 'right' ? val.side : undefined,
    });
    this.router.navigate(['/']);
  }
}
function uuidv4(): string {
  // Use the built-in crypto.randomUUID if available (modern browsers)
  if (
    typeof crypto !== 'undefined' &&
    typeof (crypto as any).randomUUID === 'function'
  ) {
    return (crypto as any).randomUUID();
  }
  // Fallback to RFC4122 v4 compliant generator using crypto.getRandomValues
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.getRandomValues === 'function'
  ) {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    // Per RFC4122 v4
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0'));
    return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex
      .slice(6, 8)
      .join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`;
  }
  // Ultimate fallback (not cryptographically strong)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
