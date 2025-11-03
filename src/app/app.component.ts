import { Component } from '@angular/core';
import { ScannerComponent } from './scanner/scanner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ScannerComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'freezer-inventory';
}