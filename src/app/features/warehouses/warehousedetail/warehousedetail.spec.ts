import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Warehousedetail } from './warehousedetail';

describe('Warehousedetail', () => {
  let component: Warehousedetail;
  let fixture: ComponentFixture<Warehousedetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Warehousedetail],
    }).compileComponents();

    fixture = TestBed.createComponent(Warehousedetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
