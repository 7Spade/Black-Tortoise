import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit search query on input', () => {
    let emittedQuery = '';
    component.searchQuery.subscribe((query: string) => {
      emittedQuery = query;
    });

    const input = fixture.nativeElement.querySelector('.search-input') as HTMLInputElement;
    input.value = 'test query';
    input.dispatchEvent(new Event('input'));

    expect(emittedQuery).toBe('test query');
  });
});
