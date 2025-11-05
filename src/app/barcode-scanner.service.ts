import { Injectable, signal } from '@angular/core';
import ScanbotSDK from 'scanbot-web-sdk/ui';

@Injectable({
  providedIn: 'root',
})
export class BarcodeScannerService {
  private readonly scanResult = signal<string | null>(null);

  constructor() {
    this.initScanbotSDK(); // Initialize SDK in constructor
  }

  // Initialization method for constructor
  private initScanbotSDK(): void {
    try {
      const settings = {
        licenseKey: '', // Add your license key or leave blank for trial
        enginePath: '/wasm/', // Location of the engine's WebAssembly/JS files
      };
      ScanbotSDK.initialize(settings);
    } catch (error) {
      console.error('Error initializing Scanbot SDK:', error);
    }
  }

  getScanResult() {
    return this.scanResult.asReadonly();
  }

  async startScanner() {
    const config = this.createScannerConfig();
    const result = await ScanbotSDK.UI.createBarcodeScanner(config);

    if (result && result.items.length > 0) {
      this.scanResult.set(result.items[0].barcode.text);
    }

    return result;
  }

  private createScannerConfig() {
    const config = new ScanbotSDK.UI.Config.BarcodeScannerScreenConfiguration();

    // Single/multi-barcode scanning configuration
    const useCase = new ScanbotSDK.UI.Config.SingleScanningMode();
    config.useCase = useCase;

    // AR overlay configuration
    useCase.arOverlay.visible = false;
    useCase.arOverlay.automaticSelectionEnabled = false;

    return config;
  }
}