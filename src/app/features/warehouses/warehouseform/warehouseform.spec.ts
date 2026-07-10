import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Warehouseform } from './warehouseform';

describe('Warehouseform', () => {
  let component: Warehouseform;
  let fixture: ComponentFixture<Warehouseform>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Warehouseform],
    }).compileComponents();

    fixture = TestBed.createComponent(Warehouseform);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
