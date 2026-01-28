/**
 * Date Format Pipe
 * Presentation Layer - Transformation
 * 
 * Pure transformation pipe for date formatting
 */

import { Pipe, PipeTransform } from '@angular/core';

type DateFormatStyle = 'short' | 'medium' | 'long' | 'full';

@Pipe({
  name: 'dateFormat',
  standalone: true,
  pure: true,
})
export class DateFormatPipe implements PipeTransform {
  transform(
    value: Date | string | number | null | undefined,
    format: DateFormatStyle = 'medium'
  ): string {
    if (!value) {
      return '';
    }

    const date = value instanceof Date ? value : new Date(value);

    if (isNaN(date.getTime())) {
      return '';
    }

    // TODO: Replace with proper date formatting (Intl.DateTimeFormat or date-fns)
    switch (format) {
      case 'short':
        return date.toLocaleDateString();
      case 'medium':
        return date.toLocaleString();
      case 'long':
        return date.toLocaleString(undefined, { 
          dateStyle: 'long', 
          timeStyle: 'short' 
        });
      case 'full':
        return date.toLocaleString(undefined, { 
          dateStyle: 'full', 
          timeStyle: 'long' 
        });
      default:
        return date.toISOString();
    }
  }
}
