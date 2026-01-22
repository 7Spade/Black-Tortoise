/**
 * Demo Dashboard Component Tests
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DemoDashboardComponent } from './demo-dashboard.component';
import { WorkspaceContextStore } from '@application/stores/workspace-context.store';

describe('DemoDashboardComponent', () => {
  let component: DemoDashboardComponent;
  let fixture: ComponentFixture<DemoDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoDashboardComponent],
      providers: [WorkspaceContextStore]
    }).compileComponents();

    fixture = TestBed.createComponent(DemoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject WorkspaceContextStore', () => {
    expect(component.workspaceContext).toBeTruthy();
  });
});
