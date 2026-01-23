import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { IdentitySwitcherComponent } from './identity-switcher.component';

describe('IdentitySwitcherComponent', () => {
  let component: IdentitySwitcherComponent;
  let fixture: ComponentFixture<IdentitySwitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdentitySwitcherComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideRouter([]),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IdentitySwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject IdentityFacade', () => {
    expect(component.facade).toBeDefined();
  });
});</content>
<parameter name="filePath">d:\GitHub\7s\Black-Tortoise\src\app\presentation\features\workspace\components\identity-switcher.component.spec.ts