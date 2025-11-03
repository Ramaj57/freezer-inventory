import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import ScanbotSDK from 'scanbot-web-sdk/ui';

@Injectable({
  providedIn: 'root',
})
export class BarcodeScannerService {
  // Signal for template-friendly reads
  private readonly scanResult = signal<string | null>(null);
  // Observable for component/class consumers that prefer RxJS
  private readonly scanResultSubject = new BehaviorSubject<string | null>(null);

  private scannerInstance: any = null;

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

  /**
   * RxJS Observable that emits every time a barcode is scanned.
   * Use this when you want to subscribe in other components/services.
   */
  getScanResult$() {
    return this.scanResultSubject.asObservable();
  }

  async startScanner() {
    try {
      if (this.scannerInstance) {
        await this.stopScanner();
      }

      const config = new ScanbotSDK.UI.Config.BarcodeScannerScreenConfiguration();
      config.useCase = new ScanbotSDK.UI.Config.MultipleScanningMode();

      this.scannerInstance = await ScanbotSDK.UI.createBarcodeScanner(config);
      
      this.scannerInstance.onDetectionResult = (result: any) => {
        console.log('Scanner detection result:', result);

        // Support multiple result shapes returned by different SDK versions
        try {
          let text: string | null = null;

          if (result?.items?.length) {
            const item = result.items[0];
            text = item?.barcode?.text ?? item?.text ?? item?.rawValue ?? null;
          } else if (result?.barcodes?.length) {
            const b = result.barcodes[0];
            text = b?.text ?? b?.rawValue ?? b?.value ?? null;
          } else {
            // Fallback: some SDKs return directly a string or code property
            const fallback = result?.code ?? result?.text ?? result;
            if (typeof fallback === 'string' && fallback.length > 0) {
              text = fallback;
            }
          }

          if (text) {
            // Update signal for templates
            this.scanResult.set(text);
            // Emit via Observable for other components
            this.scanResultSubject.next(text);
          }
        } catch (e) {
          console.error('Error processing detection result:', e);
        }
      };

      return this.scannerInstance;
    } catch (error) {
      console.error('Error starting scanner:', error);
      throw error;
    }
  }

  async stopScanner() {
    try {
      if (this.scannerInstance) {
        await this.scannerInstance.dispose();
        this.scannerInstance = null;
      }
    } catch (error) {
      console.error('Error stopping scanner:', error);
    }
  }
}