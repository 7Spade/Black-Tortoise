import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display settings card with title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-card-title')?.textContent).toContain('Settings');
  });

  it('should toggle dark mode when checkbox is changed', () => {
    expect(component.isDarkMode()).toBe(false);
    component.toggleDarkMode();
    expect(component.isDarkMode()).toBe(true);
    component.toggleDarkMode();
    expect(component.isDarkMode()).toBe(false);
  });

  it('should set saving state when saveSettings is called', (done) => {
    expect(component.saving()).toBe(false);
    component.saveSettings();
    expect(component.saving()).toBe(true);
    
    setTimeout(() => {
      expect(component.saving()).toBe(false);
      done();
    }, 700);
  });
});
