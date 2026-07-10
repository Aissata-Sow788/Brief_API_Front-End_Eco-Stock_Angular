import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Producttransfer } from './producttransfer';

describe('Producttransfer', () => {
  let component: Producttransfer;
  let fixture: ComponentFixture<Producttransfer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Producttransfer],
    }).compileComponents();

    fixture = TestBed.createComponent(Producttransfer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
