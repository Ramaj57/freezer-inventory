import { Component, inject, OnDestroy } from '@angular/core';
import { BarcodeScannerService } from '../barcode-scanner.service';

@Component({
  selector: 'app-scanner',
  standalone: true,
  imports:[],
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css'],
})
export class ScannerComponent implements OnDestroy {
  private readonly scannerService = inject(BarcodeScannerService);
  protected readonly scanResult = this.scannerService.getScanResult;
  protected isScanning = false;

  async toggleScanner() {
    try {
      if (this.isScanning) {
        await this.scannerService.stopScanner();
        this.isScanning = false;
      } else {
        await this.scannerService.startScanner();
        this.isScanning = true;
      }
    } catch (error) {
      console.error('Error toggling scanner:', error);
      this.isScanning = false;
    }
  }

  ngOnDestroy() {
    this.scannerService.stopScanner();
  }
}