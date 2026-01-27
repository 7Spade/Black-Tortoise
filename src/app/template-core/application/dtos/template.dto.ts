export interface TemplateSectionDto {
  id: string;
  title: string;
  content: string;
  orderIndex: number;
}

// Data Transfer Object for UI Presentation
// Decouples Domain Entities from View Logic
export interface TemplateDto {
  id: string;
  displayName: string; // Mapped from 'name'
  previewContent: string; // Truncated content
  sections: TemplateSectionDto[];
  lastModified: string; // Formatted date
  isNew: boolean; // Computed property
}

export interface CreateTemplateRequestDto {
  name: string;
  content: string;
}
