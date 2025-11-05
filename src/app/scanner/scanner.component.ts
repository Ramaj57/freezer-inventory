import { Component, inject } from '@angular/core';
import { BarcodeScannerService } from '../barcode-scanner.service';

@Component({
  selector: 'app-scanner',
  standalone: true,
  imports:[],
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css'],
})
export class ScannerComponent {
 private readonly scannerService = inject(BarcodeScannerService);
  protected readonly scanResult = this.scannerService.getScanResult();

  async startScanner() {
    await this.scannerService.startScanner();
  }
}