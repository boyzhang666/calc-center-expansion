// 公式模板定义
// 只保留"设计公式"作为空白模板，其他公式从后端 API 获取

// 默认的空白模板（始终存在，不可删除）
export const DEFAULT_TEMPLATE = {
  id: 'custom',
  name: '设计公式',
  description: '从空白画布开始，自由拖拽设计',
  formula: '自定义',
  nodes: [],
  edges: []
}

// 节点类型定义
export const NODE_TYPES = {
  // 输入块
  MagusAI: {
    name: '麦杰实时库模拟量输入',
    model: '输入块',
    modelId: '1',
    sysmbol: 'MagusAI',
    shape: 'op-rect-io',
    color: '#667eea',
    ports: [
      { name: 'V', desc: '数值', kind: 'out', dataType: 'Double' },
      { name: 'T', desc: '时间', kind: 'out', dataType: 'Double' },
      { name: 'S', desc: '状态', kind: 'out', dataType: 'Double' }
    ]
  },
  AIEXP: {
    name: '计算公式输入',
    model: '输入块',
    modelId: '1',
    sysmbol: 'AIEXP',
    shape: 'op-rect-io',
    color: '#f59e0b',
    ports: [
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Double' }
    ]
  },
  MagusDI: {
    name: '麦杰实时库开关量输入',
    model: '输入块',
    modelId: '1',
    sysmbol: 'MagusDI',
    shape: 'op-rect-io',
    color: '#667eea',
    ports: [
      { name: 'V', desc: '数值', kind: 'out', dataType: 'Boolean' },
      { name: 'T', desc: '时间', kind: 'out', dataType: 'Double' },
      { name: 'S', desc: '状态', kind: 'out', dataType: 'Double' }
    ]
  },
  AI: {
    name: '内存模拟量输入',
    model: '输入块',
    modelId: '1',
    sysmbol: 'AI',
    shape: 'op-rect-io',
    color: '#3b82f6',
    ports: [
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Double' }
    ]
  },
  DI: {
    name: '内存开关量输入',
    model: '输入块',
    modelId: '1',
    sysmbol: 'DI',
    shape: 'op-rect-io',
    color: '#3b82f6',
    ports: [
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Boolean' }
    ]
  },

  // 运算块
  ADD: {
    name: '加法运算(2输入)',
    model: '算术运算',
    modelId: '4',
    sysmbol: 'ADD',
    shape: 'op-rect',
    color: '#10b981',
    ports: [
      { name: 'X1', desc: '输入1', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X2', desc: '输入2', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Double' }
    ]
  },
  ADD3: {
    name: '加法运算(3输入)',
    model: '算术运算',
    modelId: '4',
    sysmbol: 'ADD3',
    shape: 'op-rect',
    color: '#10b981',
    ports: [
      { name: 'X1', desc: '输入1', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X2', desc: '输入2', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X3', desc: '输入3', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Double' }
    ]
  },
  ADD4: {
    name: '加法运算(4输入)',
    model: '算术运算',
    modelId: '4',
    sysmbol: 'ADD4',
    shape: 'op-rect',
    color: '#10b981',
    ports: [
      { name: 'X1', desc: '输入1', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X2', desc: '输入2', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X3', desc: '输入3', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X4', desc: '输入4', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Double' }
    ]
  },
  ADD5: {
    name: '加法运算(5输入)',
    model: '算术运算',
    modelId: '4',
    sysmbol: 'ADD5',
    shape: 'op-rect',
    color: '#10b981',
    ports: [
      { name: 'X1', desc: '输入1', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X2', desc: '输入2', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X3', desc: '输入3', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X4', desc: '输入4', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X5', desc: '输入5', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Double' }
    ]
  },
  ADD6: {
    name: '加法运算(6输入)',
    model: '算术运算',
    modelId: '4',
    sysmbol: 'ADD6',
    shape: 'op-rect',
    color: '#10b981',
    ports: [
      { name: 'X1', desc: '输入1', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X2', desc: '输入2', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X3', desc: '输入3', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X4', desc: '输入4', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X5', desc: '输入5', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X6', desc: '输入6', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Double' }
    ]
  },
  ADD8: {
    name: '加法运算(8输入)',
    model: '算术运算',
    modelId: '4',
    sysmbol: 'ADD8',
    shape: 'op-rect',
    color: '#10b981',
    ports: [
      { name: 'X1', desc: '输入1', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X2', desc: '输入2', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X3', desc: '输入3', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X4', desc: '输入4', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X5', desc: '输入5', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X6', desc: '输入6', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X7', desc: '输入7', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X8', desc: '输入8', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Double' }
    ]
  },
  ADD10: {
    name: '加法运算(10输入)',
    model: '算术运算',
    modelId: '4',
    sysmbol: 'ADD10',
    shape: 'op-rect',
    color: '#10b981',
    ports: [
      { name: 'X1', desc: '输入1', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X2', desc: '输入2', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X3', desc: '输入3', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X4', desc: '输入4', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X5', desc: '输入5', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X6', desc: '输入6', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X7', desc: '输入7', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X8', desc: '输入8', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X9', desc: '输入9', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X10', desc: '输入10', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Double' }
    ]
  },
  SUB: {
    name: '减法运算',
    model: '算术运算',
    modelId: '4',
    sysmbol: 'SUB',
    shape: 'op-rect',
    color: '#ef4444',
    ports: [
      { name: 'X1', desc: '输入1', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X2', desc: '输入2', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Double' }
    ]
  },
  MUL: {
    name: '乘法运算',
    model: '算术运算',
    modelId: '4',
    sysmbol: 'MUL',
    shape: 'op-rect',
    color: '#8b5cf6',
    ports: [
      { name: 'X1', desc: '输入1', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X2', desc: '输入2', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Double' }
    ]
  },
  DIV: {
    name: '除法运算',
    model: '算术运算',
    modelId: '4',
    sysmbol: 'DIV',
    shape: 'op-rect',
    color: '#06b6d4',
    ports: [
      { name: 'X1', desc: '输入1', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X2', desc: '输入2', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Double' }
    ]
  },

  // 逻辑运算块
  T: {
    name: '模拟量选择器',
    model: '逻辑运算',
    modelId: '3',
    sysmbol: 'T',
    shape: 'op-rect',
    color: '#f97316',
    ports: [
      { name: 'Soff', desc: '输入1', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'Son', desc: '输入2', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'SW', desc: '选择开关', kind: 'in', dataType: 'Boolean', dv: 'false' },
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Double' }
    ]
  },
  SW: {
    name: '开关量选择器',
    model: '逻辑运算',
    modelId: '3',
    sysmbol: 'SW',
    shape: 'op-rect',
    color: '#f97316',
    ports: [
      { name: 'Soff', desc: '输入1', kind: 'in', dataType: 'Boolean', dv: 'false' },
      { name: 'Son', desc: '输入2', kind: 'in', dataType: 'Boolean', dv: 'false' },
      { name: 'SW', desc: '选择开关', kind: 'in', dataType: 'Boolean', dv: 'false' },
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Boolean' }
    ]
  },

  // 输出块
  MagusAO: {
    name: '麦杰实时库模拟量输出',
    model: '输出块',
    modelId: '2',
    sysmbol: 'MagusAO',
    shape: 'op-rect-io',
    color: '#ec4899',
    ports: [
      { name: 'X', desc: '输入1', kind: 'in', dataType: 'Double', dv: '0' }
    ]
  },
  MagusDO: {
    name: '麦杰实时库开关量输出',
    model: '输出块',
    modelId: '2',
    sysmbol: 'MagusDO',
    shape: 'op-rect-io',
    color: '#ec4899',
    ports: [
      { name: 'X', desc: '输入1', kind: 'in', dataType: 'Boolean', dv: 'false' }
    ]
  },
  LA: {
    name: '内存模拟量输出',
    model: '输出块',
    modelId: '2',
    sysmbol: 'LA',
    shape: 'op-rect-io',
    color: '#d946ef',
    ports: [
      { name: 'Y', desc: '输入1', kind: 'in', dataType: 'Double', dv: '0' }
    ]
  },
  LD: {
    name: '内存开关量输出',
    model: '输出块',
    modelId: '2',
    sysmbol: 'LD',
    shape: 'op-rect-io',
    color: '#d946ef',
    ports: [
      { name: 'X', desc: '输入1', kind: 'in', dataType: 'Boolean', dv: 'false' }
    ]
  }
}

// 节点分类
export const NODE_CATEGORIES = [
  {
    name: '模拟量输入',
    items: ['MagusAI', 'AI', 'AIEXP']
  },
  {
    name: '开关量输入',
    items: ['MagusDI', 'DI']
  },
  {
    name: '基础运算',
    items: ['ADD', 'SUB', 'MUL', 'DIV']
  },
  {
    name: '多输入加法',
    items: ['ADD3', 'ADD4', 'ADD5', 'ADD6', 'ADD8', 'ADD10']
  },
  {
    name: '逻辑运算',
    items: ['T', 'SW']
  },
  {
    name: '模拟量输出',
    items: ['MagusAO', 'LA']
  },
  {
    name: '开关量输出',
    items: ['MagusDO', 'LD']
  }
]
