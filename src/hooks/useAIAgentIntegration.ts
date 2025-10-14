// AI Agent Integration Hook
// This hook provides workspace integration for AI agents

import { useEffect, useCallback } from 'react';
import { aiAgentIntegration } from '@/lib/ai-agent-integration';
import { agentSyncSystem } from '@/lib/agent-sync-system';

interface UseAIAgentIntegrationOptions {
  autoSync?: boolean;
  syncInterval?: number;
}

export const useAIAgentIntegration = (options: UseAIAgentIntegrationOptions = {}) => {
  const { autoSync = true, syncInterval = 30000 } = options;

  // Initialize agents on mount
  useEffect(() => {
    const initializeAgents = async () => {
      try {
        await aiAgentIntegration.initializeAgents();
        console.log('✅ AI agents initialized via hook');
      } catch (error) {
        console.error('❌ Failed to initialize AI agents via hook:', error);
      }
    };

    initializeAgents();
  }, []);

  // Auto-sync workspace changes
  useEffect(() => {
    if (!autoSync) return;

    const interval = setInterval(async () => {
      try {
        await aiAgentIntegration.updateAgentContexts();
      } catch (error) {
        console.error('❌ Failed to auto-sync agent contexts:', error);
      }
    }, syncInterval);

    return () => clearInterval(interval);
  }, [autoSync, syncInterval]);

  // Helper functions for notifying agents of workspace changes
  const notifyProjectChange = useCallback((action: 'created' | 'updated' | 'deleted', projectData: any) => {
    console.log(`📢 Project change notification: ${action}`, projectData);
    // In a real implementation, this would trigger agent notifications
  }, []);

  const notifyTaskChange = useCallback((action: 'created' | 'updated' | 'deleted', taskData: any) => {
    console.log(`📢 Task change notification: ${action}`, taskData);
    // In a real implementation, this would trigger agent notifications
  }, []);

  const notifyEmailChange = useCallback((action: 'created' | 'updated' | 'deleted', emailData: any) => {
    console.log(`📢 Email change notification: ${action}`, emailData);
    // In a real implementation, this would trigger agent notifications
  }, []);

  const notifyCRMChange = useCallback((action: 'created' | 'updated' | 'deleted', crmData: any) => {
    console.log(`📢 CRM change notification: ${action}`, crmData);
    // In a real implementation, this would trigger agent notifications
  }, []);

  // Agent interaction functions
  const getAgent = useCallback((agentId: string) => {
    return aiAgentIntegration.getAgent(agentId);
  }, []);

  const getAgentContext = useCallback((agentId: string) => {
    return aiAgentIntegration.getAgentContext(agentId);
  }, []);

  const getAllAgents = useCallback(() => {
    return aiAgentIntegration.getAllAgents();
  }, []);

  const executeAgentAction = useCallback(async (action: any) => {
    return await aiAgentIntegration.executeAgentAction(action);
  }, []);

  const sendCrossAgentMessage = useCallback(async (
    fromAgent: string,
    toAgent: string,
    message: string,
    context: string,
    priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium',
    data?: any
  ) => {
    return await aiAgentIntegration.sendCrossAgentMessage(fromAgent, toAgent, message, context, priority, data);
  }, []);

  const getSyncStats = useCallback(() => {
    return agentSyncSystem.getSyncStatistics();
  }, []);

  const refreshAgentData = useCallback(async () => {
    await aiAgentIntegration.updateAgentContexts();
  }, []);

  return {
    // Agent access
    getAgent,
    getAgentContext,
    getAllAgents,
    executeAgentAction,
    sendCrossAgentMessage,
    
    // Workspace change notifications
    notifyProjectChange,
    notifyTaskChange,
    notifyEmailChange,
    notifyCRMChange,
    
    // Sync and stats
    getSyncStats,
    refreshAgentData,
    
    // Direct access to systems
    agentIntegration: aiAgentIntegration,
    syncSystem: agentSyncSystem
  };
};
