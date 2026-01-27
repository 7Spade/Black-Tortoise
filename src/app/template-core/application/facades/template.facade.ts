import { Injectable, inject } from '@angular/core';
import { TemplateStore } from '../stores/template.store';

@Injectable({ providedIn: 'root' })
export class TemplateFacade {
  private store = inject(TemplateStore);

  // Expose Signals (Read-Only)
  readonly templates = this.store.templateDtos;
  readonly isLoading = this.store.isLoading;
  readonly error = this.store.error;

  // Expose Methods
  loadAll() {
    this.store.loadAll();
  }

  createTemplate(name: string, content: string, userId: string) {
    this.store.addTemplate({ name, content, userId });
  }

  addSection(templateId: string, title: string, content: string, userId: string) {
    this.store.addSection({ templateId, title, content, userId });
  }
}
