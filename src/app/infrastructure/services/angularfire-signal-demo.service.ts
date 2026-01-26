/**
 * AngularFire Signal Demo Service
 * 
 * Layer: Infrastructure
 * Purpose: Demonstrates AngularFire integration with Angular Signals
 * 
 * Architecture:
 * - Uses toSignal() to convert Firebase Observables to Signals
 * - Zone-less reactive patterns
 * - Type-safe Firebase queries
 * 
 * Example Usage:
 * ```typescript
 * const demoService = inject(AngularFireSignalDemoService);
 * const users = demoService.users(); // Signal<User[]>
 * ```
 */

import { Injectable, signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

/**
 * Demo User interface
 */
export interface DemoUser {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

/**
 * Demo Workspace Data interface
 */
export interface DemoWorkspaceData {
  id: string;
  name: string;
  owner: string;
  moduleCount: number;
  lastModified: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AngularFireSignalDemoService {
  /**
   * Signal-based state
   */
  private readonly isConnected = signal(false);
  private readonly connectionError = signal<string | null>(null);
  
  /**
   * Demo data as Observable (simulating Firebase)
   * In real implementation, this would be:
   * const users$ = this.firestore.collection('users').valueChanges();
   */
  private readonly users$ = this.createDemoUsersObservable();
  private readonly workspaces$ = this.createDemoWorkspacesObservable();
  
  /**
   * Convert Observables to Signals using toSignal()
   * This is the key pattern for AngularFire + Signals
   */
  readonly users = toSignal(this.users$, { initialValue: [] });
  readonly workspaces = toSignal(this.workspaces$, { initialValue: [] });
  
  /**
   * Computed signals derived from Firebase data
   */
  readonly userCount = computed(() => this.users().length);
  readonly workspaceCount = computed(() => this.workspaces().length);
  readonly isDataLoaded = computed(() => 
    this.users().length > 0 && this.workspaces().length > 0
  );
  
  constructor() {
    console.log('[AngularFireSignalDemo] Service initialized with zone-less signals');
    this.simulateConnection();
  }
  
  /**
   * Simulate Firebase connection
   */
  private simulateConnection(): void {
    setTimeout(() => {
      this.isConnected.set(true);
      console.log('[AngularFireSignalDemo] Connected to Firebase (simulated)');
    }, 1000);
  }
  
  /**
   * Create demo users observable (simulates Firestore query)
   * 
   * Real implementation would be:
   * ```typescript
   * return this.firestore
   *   .collection<DemoUser>('users')
   *   .valueChanges({ idField: 'id' })
   *   .pipe(
   *     catchError(err => {
   *       this.connectionError.set(err.message);
   *       return of([]);
   *     })
   *   );
   * ```
   */
  private createDemoUsersObservable(): Observable<DemoUser[]> {
    const demoUsers: DemoUser[] = [
      {
        id: 'user-001',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date('2024-01-15'),
      },
      {
        id: 'user-002',
        name: 'Jane Smith',
        email: 'jane@example.com',
        createdAt: new Date('2024-01-20'),
      },
      {
        id: 'user-003',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        createdAt: new Date('2024-02-01'),
      },
    ];
    
    return of(demoUsers).pipe(
      catchError(err => {
        this.connectionError.set(err.message);
        return of([]);
      })
    );
  }
  
  /**
   * Create demo workspaces observable (simulates Firestore query)
   */
  private createDemoWorkspacesObservable(): Observable<DemoWorkspaceData[]> {
    const demoWorkspaces: DemoWorkspaceData[] = [
      {
        id: 'ws-001',
        name: 'Personal Projects',
        owner: 'user-001',
        moduleCount: 11,
        lastModified: new Date(),
      },
      {
        id: 'ws-002',
        name: 'Team Collaboration',
        owner: 'user-001',
        moduleCount: 11,
        lastModified: new Date(),
      },
    ];
    
    return of(demoWorkspaces).pipe(
      catchError(err => {
        this.connectionError.set(err.message);
        return of([]);
      })
    );
  }
  
  /**
   * Example method: Get user by ID (returns computed signal)
   * 
   * Real implementation:
   * ```typescript
   * getUserById(id: string): Signal<DemoUser | undefined> {
   *   const user$ = this.firestore
   *     .doc<DemoUser>(`users/${id}`)
   *     .valueChanges();
   *   return toSignal(user$);
   * }
   * ```
   */
  getUserById(id: string) {
    return computed(() => 
      this.users().find(user => user.id === id)
    );
  }
  
  /**
   * Example method: Filter workspaces by owner
   */
  getWorkspacesByOwner(ownerId: string) {
    return computed(() => 
      this.workspaces().filter(ws => ws.owner === ownerId)
    );
  }
  
  /**
   * Connection status as computed signal
   */
  readonly connectionStatus = computed(() => {
    if (this.connectionError()) {
      return `Error: ${this.connectionError()}`;
    }
    return this.isConnected() ? 'Connected' : 'Connecting...';
  });
  
  /**
   * Example: Real-time update simulation
   * In real app, Firebase automatically pushes updates through the Observable
   */
  simulateRealtimeUpdate(): void {
    console.log('[AngularFireSignalDemo] Simulating real-time update');
    // In real implementation, Firebase handles this automatically
    // The signal will update when the Observable emits new data
  }
}
