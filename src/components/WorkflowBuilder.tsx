import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  BackgroundVariant,
  NodeTypes,
  EdgeTypes,
  ReactFlowProvider,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Save, 
  Download, 
  Upload, 
  Plus, 
  Settings,
  Bot,
  Zap,
  GitBranch,
  Code,
  MousePointer,
  Clock,
  Merge,
  Split,
  Webhook,
  CheckCircle,
  AlertCircle,
  Info,
  Minus,
  Maximize
} from 'lucide-react';

import { 
  Workflow, 
  WorkflowNode, 
  WorkflowEdge, 
  WorkflowNodeType,
  WorkflowExecution 
} from '@/types/nexus';

// Custom Node Components
const AgentActionNode = ({ data, selected }: { data: any; selected: boolean }) => (
  <div className={`px-4 py-2 shadow-md rounded-md bg-chatgpt-card border-2 min-w-[200px] ${
    selected ? 'border-blue-500' : 'border-border'
  }`}>
    <div className="flex items-center gap-2">
      <Bot className="w-4 h-4 text-blue-500" />
      <div className="font-bold text-sm text-foreground">Agent Action</div>
    </div>
    <div className="text-xs text-muted-foreground mt-1">{data.label}</div>
  </div>
);

const APICallNode = ({ data, selected }: { data: any; selected: boolean }) => (
  <div className={`px-4 py-2 shadow-md rounded-md bg-chatgpt-card border-2 min-w-[200px] ${
    selected ? 'border-green-500' : 'border-border'
  }`}>
    <div className="flex items-center gap-2">
      <Zap className="w-4 h-4 text-green-500" />
      <div className="font-bold text-sm text-foreground">API Call</div>
    </div>
    <div className="text-xs text-muted-foreground mt-1">{data.label}</div>
  </div>
);

const ConditionNode = ({ data, selected }: { data: any; selected: boolean }) => (
  <div className={`px-4 py-2 shadow-md rounded-md bg-chatgpt-card border-2 min-w-[200px] ${
    selected ? 'border-yellow-500' : 'border-border'
  }`}>
    <div className="flex items-center gap-2">
      <GitBranch className="w-4 h-4 text-yellow-500" />
      <div className="font-bold text-sm text-foreground">Condition</div>
    </div>
    <div className="text-xs text-muted-foreground mt-1">{data.label}</div>
  </div>
);

const FunctionNode = ({ data, selected }: { data: any; selected: boolean }) => (
  <div className={`px-4 py-2 shadow-md rounded-md bg-chatgpt-card border-2 min-w-[200px] ${
    selected ? 'border-purple-500' : 'border-border'
  }`}>
    <div className="flex items-center gap-2">
      <Code className="w-4 h-4 text-purple-500" />
      <div className="font-bold text-sm text-foreground">Function</div>
    </div>
    <div className="text-xs text-muted-foreground mt-1">{data.label}</div>
  </div>
);

const TriggerNode = ({ data, selected }: { data: any; selected: boolean }) => (
  <div className={`px-4 py-2 shadow-md rounded-md bg-chatgpt-card border-2 min-w-[200px] ${
    selected ? 'border-orange-500' : 'border-border'
  }`}>
    <div className="flex items-center gap-2">
      <Webhook className="w-4 h-4 text-orange-500" />
      <div className="font-bold text-sm text-foreground">Trigger</div>
    </div>
    <div className="text-xs text-muted-foreground mt-1">{data.label}</div>
  </div>
);

const EndNode = ({ data, selected }: { data: any; selected: boolean }) => (
  <div className={`px-4 py-2 shadow-md rounded-md bg-chatgpt-card border-2 min-w-[200px] ${
    selected ? 'border-red-500' : 'border-border'
  }`}>
    <div className="flex items-center gap-2">
      <CheckCircle className="w-4 h-4 text-red-500" />
      <div className="font-bold text-sm text-foreground">End</div>
    </div>
    <div className="text-xs text-muted-foreground mt-1">{data.label}</div>
  </div>
);

const DelayNode = ({ data, selected }: { data: any; selected: boolean }) => (
  <div className={`px-4 py-2 shadow-md rounded-md bg-chatgpt-card border-2 min-w-[200px] ${
    selected ? 'border-indigo-500' : 'border-border'
  }`}>
    <div className="flex items-center gap-2">
      <Clock className="w-4 h-4 text-indigo-500" />
      <div className="font-bold text-sm text-foreground">Delay</div>
    </div>
    <div className="text-xs text-muted-foreground mt-1">{data.label}</div>
  </div>
);

const MergeNode = ({ data, selected }: { data: any; selected: boolean }) => (
  <div className={`px-4 py-2 shadow-md rounded-md bg-chatgpt-card border-2 min-w-[200px] ${
    selected ? 'border-teal-500' : 'border-border'
  }`}>
    <div className="flex items-center gap-2">
      <Merge className="w-4 h-4 text-teal-500" />
      <div className="font-bold text-sm text-foreground">Merge</div>
    </div>
    <div className="text-xs text-muted-foreground mt-1">{data.label}</div>
  </div>
);

const SplitNode = ({ data, selected }: { data: any; selected: boolean }) => (
  <div className={`px-4 py-2 shadow-md rounded-md bg-chatgpt-card border-2 min-w-[200px] ${
    selected ? 'border-pink-500' : 'border-border'
  }`}>
    <div className="flex items-center gap-2">
      <Split className="w-4 h-4 text-pink-500" />
      <div className="font-bold text-sm text-foreground">Split</div>
    </div>
    <div className="text-xs text-muted-foreground mt-1">{data.label}</div>
  </div>
);

const nodeTypes: NodeTypes = {
  'agent-action': AgentActionNode,
  'api-call': APICallNode,
  'condition': ConditionNode,
  'function': FunctionNode,
  'trigger': TriggerNode,
  'end': EndNode,
  'delay': DelayNode,
  'merge': MergeNode,
  'split': SplitNode,
};

const NODE_TEMPLATES = [
  {
    type: 'trigger' as WorkflowNodeType,
    label: 'Webhook Trigger',
    description: 'Starts workflow on webhook call',
    icon: <Webhook className="w-4 h-4" />,
    color: 'orange'
  },
  {
    type: 'agent-action' as WorkflowNodeType,
    label: 'Agent Action',
    description: 'Execute agent task',
    icon: <Bot className="w-4 h-4" />,
    color: 'blue'
  },
  {
    type: 'api-call' as WorkflowNodeType,
    label: 'API Call',
    description: 'Call external API',
    icon: <Zap className="w-4 h-4" />,
    color: 'green'
  },
  {
    type: 'condition' as WorkflowNodeType,
    label: 'Condition',
    description: 'If/else logic',
    icon: <GitBranch className="w-4 h-4" />,
    color: 'yellow'
  },
  {
    type: 'function' as WorkflowNodeType,
    label: 'Function',
    description: 'Custom JavaScript code',
    icon: <Code className="w-4 h-4" />,
    color: 'purple'
  },
  {
    type: 'delay' as WorkflowNodeType,
    label: 'Delay',
    description: 'Wait for specified time',
    icon: <Clock className="w-4 h-4" />,
    color: 'indigo'
  },
  {
    type: 'merge' as WorkflowNodeType,
    label: 'Merge',
    description: 'Combine multiple inputs',
    icon: <Merge className="w-4 h-4" />,
    color: 'teal'
  },
  {
    type: 'split' as WorkflowNodeType,
    label: 'Split',
    description: 'Split into multiple paths',
    icon: <Split className="w-4 h-4" />,
    color: 'pink'
  },
  {
    type: 'end' as WorkflowNodeType,
    label: 'End',
    description: 'End workflow',
    icon: <CheckCircle className="w-4 h-4" />,
    color: 'red'
  }
];

interface WorkflowBuilderProps {
  workflow?: Workflow;
  onSave?: (workflow: Workflow) => void;
  onExecute?: (workflowId: string) => void;
}

function WorkflowBuilderContent({ workflow, onSave, onExecute }: WorkflowBuilderProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    workflow?.nodes?.map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data,
    })) || []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    workflow?.edges?.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: edge.type || 'default',
    })) || []
  );
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isNodeConfigOpen, setIsNodeConfigOpen] = useState(false);
  const [workflowName, setWorkflowName] = useState(workflow?.name || 'Untitled Workflow');
  const [workflowDescription, setWorkflowDescription] = useState(workflow?.description || '');

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = useCallback(
    (nodeType: WorkflowNodeType) => {
      const newNode: Node = {
        id: `node_${Date.now()}`,
        type: nodeType,
        position: { x: Math.random() * 400, y: Math.random() * 400 },
        data: {
          label: NODE_TEMPLATES.find(t => t.type === nodeType)?.label || 'Node',
          ...NODE_TEMPLATES.find(t => t.type === nodeType)
        },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setIsNodeConfigOpen(true);
  }, []);

  const saveWorkflow = useCallback(() => {
    if (!workflowName.trim()) {
      alert('Please enter a workflow name');
      return;
    }

    const newWorkflow: Workflow = {
      id: workflow?.id || `workflow_${Date.now()}`,
      name: workflowName,
      description: workflowDescription,
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type as WorkflowNodeType,
        position: node.position,
        data: node.data,
        config: node.data.config || {}
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type as any,
      })),
      triggers: [],
      status: 'draft',
      createdAt: workflow?.createdAt || new Date(),
      updatedAt: new Date(),
      createdBy: 'current-user', // TODO: Get from auth context
      executions: []
    };

    onSave?.(newWorkflow);
  }, [workflowName, workflowDescription, nodes, edges, workflow, onSave]);

  const executeWorkflow = useCallback(() => {
    if (workflow?.id) {
      onExecute?.(workflow.id);
    }
  }, [workflow?.id, onExecute]);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 bg-chatgpt-card border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Workflow Builder</h2>
          <div className="mt-2 space-y-2">
            <Input
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              placeholder="Workflow name"
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
            <Textarea
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
              placeholder="Description"
              rows={2}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex gap-2 mt-3">
            <Button onClick={saveWorkflow} size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button onClick={executeWorkflow} size="sm" variant="outline">
              <Play className="w-4 h-4 mr-2" />
              Execute
            </Button>
          </div>
        </div>

        {/* Node Templates */}
        <div className="flex-1 p-4 overflow-y-auto scrollbar-hide">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Add Nodes</h3>
          <div className="space-y-2">
            {NODE_TEMPLATES.map((template) => (
              <div
                key={template.type}
                className="p-3 border border-border rounded-lg cursor-pointer hover:bg-background/50 transition-colors"
                onClick={() => addNode(template.type)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-${template.color}-500/20 flex items-center justify-center`}>
                    {template.icon}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-foreground">{template.label}</div>
                    <div className="text-xs text-muted-foreground">{template.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Node Configuration */}
        {selectedNode && (
          <div className="p-4 border-t border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Configure Node</h3>
            <div className="space-y-2">
              <Input
                value={selectedNode.data.label}
                onChange={(e) => {
                  setSelectedNode({
                    ...selectedNode,
                    data: { ...selectedNode.data, label: e.target.value }
                  });
                  setNodes(nds => nds.map(n => 
                    n.id === selectedNode.id 
                      ? { ...n, data: { ...n.data, label: e.target.value } }
                      : n
                  ));
                }}
                placeholder="Node label"
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
              <Textarea
                value={selectedNode.data.description || ''}
                onChange={(e) => {
                  setSelectedNode({
                    ...selectedNode,
                    data: { ...selectedNode.data, description: e.target.value }
                  });
                  setNodes(nds => nds.map(n => 
                    n.id === selectedNode.id 
                      ? { ...n, data: { ...n.data, description: e.target.value } }
                      : n
                  ));
                }}
                placeholder="Node description"
                rows={2}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          style={{ background: 'transparent' }}
        >
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={12} 
            size={1} 
            color="rgba(255, 255, 255, 0.1)"
          />
        </ReactFlow>

        {/* Custom Zoom Controls - Top Left */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="bg-background/90 backdrop-blur-sm rounded-lg shadow-lg border border-border p-1 flex flex-col gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => reactFlowInstance?.zoomIn()}
              className="h-8 w-8 p-0 hover:bg-background/50"
              title="Zoom In"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => reactFlowInstance?.zoomOut()}
              className="h-8 w-8 p-0 hover:bg-background/50"
              title="Zoom Out"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => reactFlowInstance?.fitView()}
              className="h-8 w-8 p-0 hover:bg-background/50"
              title="Fit View"
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorkflowBuilder(props: WorkflowBuilderProps) {
  return (
    <ReactFlowProvider>
      <WorkflowBuilderContent {...props} />
    </ReactFlowProvider>
  );
}
