import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkspaceCreateTriggerComponent } from './workspace-create-trigger.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('WorkspaceCreateTriggerComponent', () => {
  let component: WorkspaceCreateTriggerComponent;
  let fixture: ComponentFixture<WorkspaceCreateTriggerComponent>;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceCreateTriggerComponent, MatDialogModule],
      providers: [
        provideExperimentalZonelessChangeDetection(),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkspaceCreateTriggerComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have MatDialog injected', () => {
    expect(dialog).toBeTruthy();
  });
});
