import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { WorkspaceCreateTriggerComponent } from './workspace-create-trigger.component';
import { of } from 'rxjs';

describe('WorkspaceCreateTriggerComponent', () => {
  let component: WorkspaceCreateTriggerComponent;
  let fixture: ComponentFixture<WorkspaceCreateTriggerComponent>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    
    await TestBed.configureTestingModule({
      imports: [WorkspaceCreateTriggerComponent, MatDialogModule],
      providers: [
        { provide: MatDialog, useValue: mockDialog }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkspaceCreateTriggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open dialog when openDialog is called', () => {
    const mockDialogRef = {
      afterClosed: () => of({ workspaceName: 'Test Workspace' })
    };
    mockDialog.open.and.returnValue(mockDialogRef as any);

    const result$ = component.openDialog();
    
    expect(mockDialog.open).toHaveBeenCalled();
    expect(result$).toBeTruthy();
  });
});
