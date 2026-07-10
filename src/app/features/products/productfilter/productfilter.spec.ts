import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Productfilter } from './productfilter';

describe('Productfilter', () => {
  let component: Productfilter;
  let fixture: ComponentFixture<Productfilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Productfilter],
    }).compileComponents();

    fixture = TestBed.createComponent(Productfilter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
