import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeliverPage } from './deliver.page';

describe('DeliverPage', () => {
  let component: DeliverPage;
  let fixture: ComponentFixture<DeliverPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
