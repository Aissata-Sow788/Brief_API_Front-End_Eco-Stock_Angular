import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Productform } from './productform';

describe('Productform', () => {
  let component: Productform;
  let fixture: ComponentFixture<Productform>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Productform],
    }).compileComponents();

    fixture = TestBed.createComponent(Productform);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
