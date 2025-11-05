import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScannerConsumerComponent } from './scanner-consumer.component';

describe('ScannerConsumerComponent', () => {
  let component: ScannerConsumerComponent;
  let fixture: ComponentFixture<ScannerConsumerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScannerConsumerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScannerConsumerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
