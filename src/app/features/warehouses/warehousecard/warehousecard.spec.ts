import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Warehousecard } from './warehousecard';

describe('Warehousecard', () => {
  let component: Warehousecard;
  let fixture: ComponentFixture<Warehousecard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Warehousecard],
    }).compileComponents();

    fixture = TestBed.createComponent(Warehousecard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
