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
  MagusAIStat: {
    name: '麦杰实时库模拟量统计值输入',
    model: '输入块',
    modelId: '1',
    sysmbol: 'MagusAIStat',
    shape: 'op-rect-io',
    color: '#667eea',
    ports: [
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Double' }
    ]
  },
  RedisAI: {
    name: 'redis模拟量输入',
    model: '输入块',
    modelId: '1',
    sysmbol: 'RedisAI',
    shape: 'op-rect-io',
    color: '#dc2626',
    ports: [
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Double' }
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
  ABS: {
    name: '绝对值运算',
    model: '算术运算',
    modelId: '4',
    sysmbol: 'ABS',
    shape: 'op-rect',
    color: '#14b8a6',
    ports: [
      { name: 'X1', desc: '输入1', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Double' }
    ]
  },
  AD: {
    name: '模数转换运算',
    model: '算术运算',
    modelId: '4',
    sysmbol: 'AD',
    shape: 'op-rect',
    color: '#14b8a6',
    ports: [
      { name: 'X1', desc: '输入1', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Boolean' }
    ]
  },
  DA: {
    name: '数模转换运算',
    model: '算术运算',
    modelId: '4',
    sysmbol: 'DA',
    shape: 'op-rect',
    color: '#14b8a6',
    ports: [
      { name: 'X1', desc: '输入1', kind: 'in', dataType: 'Boolean', dv: 'false' },
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Double' }
    ]
  },
  AVG: {
    name: '平均值',
    model: '算术运算',
    modelId: '4',
    sysmbol: 'AVG',
    shape: 'op-rect',
    color: '#10b981',
    ports: [
      { name: 'X1', desc: '输入1', kind: 'in', dataType: 'Double', dv: '0.0' },
      { name: 'X2', desc: '输入2', kind: 'in', dataType: 'Double', dv: '0.0' },
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Double' }
    ]
  },
  EXP: {
    name: '指数运算',
    model: '算术运算',
    modelId: '4',
    sysmbol: 'EXP',
    shape: 'op-rect',
    color: '#8b5cf6',
    ports: [
      { name: 'X', desc: '输入', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'Y', desc: '输出', kind: 'out', dataType: 'Double' }
    ]
  },
  LOG: {
    name: '自然对数',
    model: '算术运算',
    modelId: '4',
    sysmbol: 'LOG',
    shape: 'op-rect',
    color: '#8b5cf6',
    ports: [
      { name: 'X', desc: '输入', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'Y', desc: '输出', kind: 'out', dataType: 'Double' }
    ]
  },
  PWR: {
    name: '幂运算',
    model: '算术运算',
    modelId: '4',
    sysmbol: 'PWR',
    shape: 'op-rect',
    color: '#8b5cf6',
    ports: [
      { name: 'a', desc: '输入1', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'b', desc: '输入2', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Double' }
    ]
  },
  ROOT: {
    name: '开根号',
    model: '算术运算',
    modelId: '4',
    sysmbol: 'ROOT',
    shape: 'op-rect',
    color: '#8b5cf6',
    ports: [
      { name: 'X', desc: '输入', kind: 'in', dataType: 'Double', dv: ' X>=0' },
      { name: 'Y', desc: '输出', kind: 'out', dataType: 'Double' }
    ]
  },
  INT: {
    name: '取整',
    model: '算术运算',
    modelId: '4',
    sysmbol: 'INT',
    shape: 'op-rect',
    color: '#06b6d4',
    ports: [
      { name: 'X', desc: '输入', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'M', desc: '模式', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'Y', desc: '输出Y1', kind: 'out', dataType: 'Double' }
    ]
  },
  QUO: {
    name: '余商运算',
    model: '算术运算',
    modelId: '4',
    sysmbol: 'QUO',
    shape: 'op-rect',
    color: '#06b6d4',
    ports: [
      { name: 'X1', desc: '输入', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'K1', desc: 'X1的增益', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'C1', desc: 'X1的偏置', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X2', desc: '输入', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'K2', desc: 'X2的增益', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'C2', desc: 'X2的偏置', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'YQUO', desc: '商', kind: 'out', dataType: 'Double' },
      { name: 'YREM', desc: '余数', kind: 'out', dataType: 'Double' }
    ]
  },
  MIN3: {
    name: '取最小(3输入)',
    model: '算术运算',
    modelId: '4',
    sysmbol: 'MIN3',
    shape: 'op-rect',
    color: '#10b981',
    ports: [
      { name: 'X1', desc: '输入1', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X2', desc: '输入2', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X3', desc: '输入3', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'Y', desc: '输出', kind: 'out', dataType: 'Double' }
    ]
  },

  // 比较运算块
  CMP: {
    name: '比较运算',
    model: '比较运算',
    modelId: '5',
    sysmbol: 'CMP',
    shape: 'op-rect',
    color: '#0ea5e9',
    ports: [
      { name: 'X1', desc: '输入1', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X2', desc: '输入2', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'M', desc: '0:>; 1:>=; 2:<; 3:<=; 4:== 5: !=', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Boolean' }
    ]
  },
  GRT: {
    name: '大于',
    model: '比较运算',
    modelId: '5',
    sysmbol: 'GRT',
    shape: 'op-rect',
    color: '#0ea5e9',
    ports: [
      { name: 'X1', desc: '输入1', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X2', desc: '输入2', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Boolean' }
    ]
  },
  LES: {
    name: '小于',
    model: '比较运算',
    modelId: '5',
    sysmbol: 'LES',
    shape: 'op-rect',
    color: '#0ea5e9',
    ports: [
      { name: 'X1', desc: '输入1', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'X2', desc: '输入2', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Boolean' }
    ]
  },
  BETWEEN: {
    name: 'X在最小最大值之间',
    model: '比较运算',
    modelId: '5',
    sysmbol: 'BETWEEN',
    shape: 'op-rect',
    color: '#0ea5e9',
    ports: [
      { name: 'X', desc: '最小值', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'Min', desc: '最小值', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'Max', desc: '最大值', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Boolean' }
    ]
  },
  MAX: {
    name: '最大值',
    model: '比较运算',
    modelId: '5',
    sysmbol: 'MAX',
    shape: 'op-rect',
    color: '#0ea5e9',
    ports: [
      { name: 'X1', desc: '输入1', kind: 'in', dataType: 'Double', dv: '0.0' },
      { name: 'X2', desc: '输入2', kind: 'in', dataType: 'Double', dv: '0.0' },
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Double' }
    ]
  },
  MIN: {
    name: '最小值',
    model: '比较运算',
    modelId: '5',
    sysmbol: 'MIN',
    shape: 'op-rect',
    color: '#0ea5e9',
    ports: [
      { name: 'X1', desc: '输入1', kind: 'in', dataType: 'Double', dv: '0.0' },
      { name: 'X2', desc: '输入2', kind: 'in', dataType: 'Double', dv: '0.0' },
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
  AND: {
    name: '且运算',
    model: '逻辑运算',
    modelId: '3',
    sysmbol: 'AND',
    shape: 'op-rect',
    color: '#f97316',
    ports: [
      { name: 'X1', desc: '输入1', kind: 'in', dataType: 'Boolean', dv: 'true' },
      { name: 'X2', desc: '输入2', kind: 'in', dataType: 'Boolean', dv: 'true' },
      { name: 'X3', desc: '输入3', kind: 'in', dataType: 'Boolean', dv: 'true' },
      { name: 'X4', desc: '输入4', kind: 'in', dataType: 'Boolean', dv: 'true' },
      { name: 'X5', desc: '输入5', kind: 'in', dataType: 'Boolean', dv: 'true' },
      { name: 'X6', desc: '输入6', kind: 'in', dataType: 'Boolean', dv: 'true' },
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Boolean' }
    ]
  },
  OR: {
    name: '或运算',
    model: '逻辑运算',
    modelId: '3',
    sysmbol: 'OR',
    shape: 'op-rect',
    color: '#f97316',
    ports: [
      { name: 'X1', desc: '输入1', kind: 'in', dataType: 'Boolean', dv: 'false' },
      { name: 'X2', desc: '输入2', kind: 'in', dataType: 'Boolean', dv: 'false' },
      { name: 'X3', desc: '输入3', kind: 'in', dataType: 'Boolean', dv: 'false' },
      { name: 'X4', desc: '输入4', kind: 'in', dataType: 'Boolean', dv: 'false' },
      { name: 'X5', desc: '输入5', kind: 'in', dataType: 'Boolean', dv: 'false' },
      { name: 'X6', desc: '输入6', kind: 'in', dataType: 'Boolean', dv: 'false' },
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Boolean' }
    ]
  },
  DWE: {
    name: '位提取器',
    model: '逻辑运算',
    modelId: '3',
    sysmbol: 'DWE',
    shape: 'op-rect',
    color: '#f97316',
    ports: [
      { name: 'X', desc: '输入', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'IDX', desc: '位数，0-64', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'Y', desc: '1：true;0：false', kind: 'out', dataType: 'Boolean' }
    ]
  },
  NOT: {
    name: '非运算',
    model: '逻辑运算',
    modelId: '3',
    sysmbol: 'NOT',
    shape: 'op-rect',
    color: '#f97316',
    ports: [
      { name: 'X1', desc: '输入1', kind: 'in', dataType: 'Boolean', dv: 'false' },
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Boolean' }
    ]
  },
  ANDW: {
    name: '双字逻辑与运算',
    model: '逻辑运算',
    modelId: '3',
    sysmbol: 'ANDW',
    shape: 'op-rect',
    color: '#f97316',
    ports: [
      { name: 'X1', desc: '输入1', kind: 'in', dataType: 'Boolean', dv: 'false' },
      { name: 'X2', desc: '输入2', kind: 'in', dataType: 'Boolean', dv: 'false' },
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Boolean' }
    ]
  },
  DGC: {
    name: '开关量输入统计',
    model: '逻辑运算',
    modelId: '3',
    sysmbol: 'DGC',
    shape: 'op-rect',
    color: '#f97316',
    ports: [
      { name: 'x1', desc: '输入1', kind: 'in', dataType: 'Boolean', dv: 'false' },
      { name: 'x2', desc: '输入2', kind: 'in', dataType: 'Boolean', dv: 'false' },
      { name: 'x3', desc: '输入3', kind: 'in', dataType: 'Boolean', dv: 'false' },
      { name: 'x4', desc: '输入4', kind: 'in', dataType: 'Boolean', dv: 'false' },
      { name: 'x5', desc: '输入5', kind: 'in', dataType: 'Boolean', dv: 'false' },
      { name: 'x6', desc: '输入6', kind: 'in', dataType: 'Boolean', dv: 'false' },
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Double' }
    ]
  },
  MON: {
    name: '位数量判断',
    model: '逻辑运算',
    modelId: '3',
    sysmbol: 'MON',
    shape: 'op-rect',
    color: '#f97316',
    ports: [
      { name: 'x1', desc: '输入1', kind: 'in', dataType: 'Boolean', dv: 'false' },
      { name: 'x2', desc: '输入2', kind: 'in', dataType: 'Boolean', dv: 'false' },
      { name: 'x3', desc: '输入3', kind: 'in', dataType: 'Boolean', dv: 'false' },
      { name: 'x4', desc: '输入4', kind: 'in', dataType: 'Boolean', dv: 'false' },
      { name: 'x5', desc: '输入5', kind: 'in', dataType: 'Boolean', dv: 'false' },
      { name: 'Bn', desc: '阀值', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'Y', desc: 'M>Bn', kind: 'out', dataType: 'Boolean' },
      { name: 'Yn', desc: '输入为1的数量', kind: 'out', dataType: 'Double' }
    ]
  },
  NGA: {
    name: '模拟量质量差',
    model: '逻辑运算',
    modelId: '3',
    sysmbol: 'NGA',
    shape: 'op-rect',
    color: '#f97316',
    ports: [
      { name: 'X', desc: '输入X', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'NG', desc: 'false:好;true坏', kind: 'in', dataType: 'Boolean', dv: 'false' },
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Double' }
    ]
  },
  NGD: {
    name: '开关量质量差',
    model: '逻辑运算',
    modelId: '3',
    sysmbol: 'NGD',
    shape: 'op-rect',
    color: '#f97316',
    ports: [
      { name: 'X', desc: '输入X', kind: 'in', dataType: 'Boolean', dv: 'false' },
      { name: 'NG', desc: 'false:好;true坏', kind: 'in', dataType: 'Boolean', dv: 'false' },
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Boolean' }
    ]
  },

  // 定时器/计数器块
  TON: {
    name: '上升沿脉冲',
    model: '定时器/计数器',
    modelId: '6',
    sysmbol: 'TON',
    shape: 'op-rect',
    color: '#a855f7',
    ports: [
      { name: 'X', desc: '输入1', kind: 'in', dataType: 'Boolean', dv: 'false' },
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Boolean' }
    ]
  },
  TOF: {
    name: '下降沿脉冲',
    model: '定时器/计数器',
    modelId: '6',
    sysmbol: 'TOF',
    shape: 'op-rect',
    color: '#a855f7',
    ports: [
      { name: 'X', desc: '输入1', kind: 'in', dataType: 'Boolean', dv: 'false' },
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Boolean' }
    ]
  },
  TimeSplit: {
    name: '时间切分',
    model: '定时器/计数器',
    modelId: '6',
    sysmbol: 'TimeSplit',
    shape: 'op-rect',
    color: '#a855f7',
    ports: [
      { name: 'X', desc: '时间(S)，0:当前时间，默认', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'M', desc: '模式：0：1970-01-01 08:00:00到当前秒，默认；1：年；2：月；3：日；4：时；5：分；6：秒', kind: 'in', dataType: 'Double', dv: '0' },
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Double' }
    ]
  },
  CLOCK: {
    name: '时分秒',
    model: '定时器/计数器',
    modelId: '6',
    sysmbol: 'CLOCK',
    shape: 'op-rect',
    color: '#a855f7',
    ports: [
      { name: 'Y', desc: '输出Y', kind: 'out', dataType: 'Double' }
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
    items: ['MagusAI', 'MagusAIStat', 'AI', 'AIEXP', 'RedisAI']
  },
  {
    name: '开关量输入',
    items: ['MagusDI', 'DI']
  },
  {
    name: '基础运算',
    items: ['ADD', 'SUB', 'MUL', 'DIV', 'ABS', 'AD', 'DA']
  },
  {
    name: '多输入加法',
    items: ['ADD3', 'ADD4', 'ADD5', 'ADD6', 'ADD8', 'ADD10']
  },
  {
    name: '数学函数',
    items: ['AVG', 'EXP', 'LOG', 'PWR', 'ROOT', 'INT', 'QUO', 'MIN3']
  },
  {
    name: '比较运算',
    items: ['CMP', 'GRT', 'LES', 'BETWEEN', 'MAX', 'MIN']
  },
  {
    name: '逻辑运算',
    items: ['T', 'SW', 'AND', 'OR', 'NOT', 'ANDW', 'DWE']
  },
  {
    name: '逻辑统计/质量',
    items: ['DGC', 'MON', 'NGA', 'NGD']
  },
  {
    name: '定时器/计数器',
    items: ['TON', 'TOF', 'TimeSplit', 'CLOCK']
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
