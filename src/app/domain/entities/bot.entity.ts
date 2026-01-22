/**
 * Bot Entity
 * 
 * Layer: Domain
 * DDD Pattern: Entity
 * 
 * Represents an automated bot/agent in the system.
 * Bots can perform automated tasks and interact with workspaces.
 */

export type BotType = 'automation' | 'integration' | 'assistant' | 'webhook';

export interface BotEntity {
  readonly id: string;
  readonly name: string;
  readonly botType: BotType;
  readonly workspaceId: string;
  readonly apiKey: string;
  readonly description?: string;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Create a new Bot entity
 */
export function createBot(
  id: string,
  name: string,
  botType: BotType,
  workspaceId: string,
  apiKey: string,
  description?: string
): BotEntity {
  return {
    id,
    name,
    botType,
    workspaceId,
    apiKey,
    description,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Activate bot
 */
export function activateBot(bot: BotEntity): BotEntity {
  return {
    ...bot,
    isActive: true,
    updatedAt: new Date(),
  };
}

/**
 * Deactivate bot
 */
export function deactivateBot(bot: BotEntity): BotEntity {
  return {
    ...bot,
    isActive: false,
    updatedAt: new Date(),
  };
}

/**
 * Update bot details
 */
export function updateBot(
  bot: BotEntity,
  name?: string,
  description?: string
): BotEntity {
  return {
    ...bot,
    name: name ?? bot.name,
    description: description ?? bot.description,
    updatedAt: new Date(),
  };
}

/**
 * Rotate bot API key
 */
export function rotateBotApiKey(
  bot: BotEntity,
  newApiKey: string
): BotEntity {
  return {
    ...bot,
    apiKey: newApiKey,
    updatedAt: new Date(),
  };
}
