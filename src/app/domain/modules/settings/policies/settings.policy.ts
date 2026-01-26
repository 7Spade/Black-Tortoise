/**
 * Settings Policy
 * 
 * Layer: Domain
 * DDD Pattern: Policy
 */

import { WorkspaceSettingsEntity } from '../aggregates';

const SUPPORTED_THEMES = ['light', 'dark', 'system'];
const SUPPORTED_LANGUAGES = ['en', 'zh-TW', 'zh-CN', 'ja'];

/**
 * Validate settings updates
 */
export function validateSettingsUpdate(
  updates: Partial<WorkspaceSettingsEntity>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (updates.theme && !SUPPORTED_THEMES.includes(updates.theme)) {
    errors.push(`Invalid theme: ${updates.theme}. Supported: ${SUPPORTED_THEMES.join(', ')}`);
  }

  if (updates.language && !SUPPORTED_LANGUAGES.includes(updates.language)) {
    errors.push(`Invalid language: ${updates.language}. Supported: ${SUPPORTED_LANGUAGES.join(', ')}`);
  }

  return { valid: errors.length === 0, errors };
}
