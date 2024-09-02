import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogicComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LogicComponent;
  let fixture: ComponentFixture<LogicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
