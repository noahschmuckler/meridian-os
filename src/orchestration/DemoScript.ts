// Demo script orchestrator. Loads canned LLM responses + triggers from data/demo-script.json.
// Phase 0: minimal dispatcher; primitives + cells subscribe to events the workspace's scripted block declares.

import type { ScriptedAction, WorkspaceConfig } from '../types';

export interface DemoScriptDispatcher {
  fireOnMount(workspace: WorkspaceConfig): Promise<void>;
  fireOnSearch(workspace: WorkspaceConfig, query: string): Promise<void>;
  fireOnDrop(workspace: WorkspaceConfig, droppedBubbleType: string): Promise<void>;
}

export interface DemoScriptHandlers {
  onAction: (action: ScriptedAction) => void | Promise<void>;
}

export function createDemoScript(handlers: DemoScriptHandlers): DemoScriptDispatcher {
  async function dispatch(actions: ScriptedAction[] | undefined): Promise<void> {
    if (!actions) return;
    for (const action of actions) {
      const delay =
        action.kind === 'chat-say' && action.delayMs ? action.delayMs : 0;
      if (delay > 0) await new Promise((r) => setTimeout(r, delay));
      await handlers.onAction(action);
    }
  }

  return {
    fireOnMount: (ws) => dispatch(ws.scripted.onMount),
    fireOnSearch: (ws, query) => dispatch(ws.scripted.onSearch?.[query]),
    fireOnDrop: (ws, type) => dispatch(ws.scripted.onDrop?.[type]),
  };
}
