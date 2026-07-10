import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Productcard } from './productcard';

describe('Productcard', () => {
  let component: Productcard;
  let fixture: ComponentFixture<Productcard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Productcard],
    }).compileComponents();

    fixture = TestBed.createComponent(Productcard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
