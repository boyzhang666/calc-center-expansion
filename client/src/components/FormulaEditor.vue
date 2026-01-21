<template>
  <div class="formula-editor h-full flex">
    <!-- 左侧面板：公式模板 / 节点库 -->
    <div class="w-52 bg-gray-50 border-r flex flex-col">
      <!-- 切换按钮 -->
      <div class="flex border-b">
        <button
          class="flex-1 py-2 text-sm font-medium transition-colors"
          :class="activeTab === 'template' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'"
          @click="activeTab = 'template'"
        >
          公式库
        </button>
        <button
          class="flex-1 py-2 text-sm font-medium transition-colors"
          :class="activeTab === 'node' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'"
          @click="activeTab = 'node'"
        >
          算子库
        </button>
      </div>

      <!-- 公式模板列表 -->
      <div v-show="activeTab === 'template'" class="flex-1 overflow-y-auto p-3">
        <!-- 加载中 -->
        <div v-if="templatesLoading" class="flex items-center justify-center py-4 text-gray-400 text-sm">
          <span>加载中...</span>
        </div>
        <!-- 模板列表 -->
        <div v-else class="space-y-2">
          <div
            v-for="tpl in templates"
            :key="tpl.id"
            class="template-item p-2 rounded-lg cursor-pointer transition-all text-sm flex items-center justify-between group"
            :class="{
              'bg-blue-50 border-2 border-blue-500': currentTemplate?.id === tpl.id,
              'bg-white border-2 border-transparent hover:bg-gray-100': currentTemplate?.id !== tpl.id
            }"
            @click="selectTemplate(tpl)"
          >
            <div class="flex-1 min-w-0">
              <div class="font-medium text-gray-800">{{ tpl.name }}</div>
              <div class="text-xs text-gray-400 mt-0.5">{{ tpl.formula || '拖拽设计' }}</div>
            </div>
            <!-- 删除按钮（设计公式不能删除） -->
            <el-button
              v-if="tpl.id !== 'custom'"
              class="delete-btn opacity-0 group-hover:opacity-100 transition-opacity ml-2"
              type="danger"
              :icon="Delete"
              size="small"
              circle
              @click.stop="deleteTemplate(tpl)"
            />
          </div>
        </div>
      </div>

      <!-- 节点库 -->
      <div v-show="activeTab === 'node'" class="flex-1 overflow-y-auto p-3">
        <div v-for="category in nodeCategories" :key="category.name" class="mb-4">
          <div class="text-xs text-gray-500 mb-2">{{ category.name }}</div>
          <div class="space-y-2">
            <div
              v-for="item in category.items"
              :key="item"
              class="node-item p-2 bg-white rounded border cursor-move text-xs"
              :style="{ borderLeftColor: nodeTypes[item]?.color, borderLeftWidth: '3px' }"
              draggable="true"
              @dragstart="onDragStart($event, item)"
            >
              <div class="font-medium">{{ nodeTypes[item]?.sysmbol }}</div>
              <div class="text-gray-400 text-xs mt-0.5">{{ nodeTypes[item]?.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 中间画布 -->
    <div class="flex-1 relative">
      <div ref="containerRef" class="w-full h-full"></div>

      <!-- 工具栏 -->
      <div class="absolute top-3 right-3 flex gap-2">
        <el-button-group size="small">
          <el-button @click="zoomIn" :icon="ZoomIn" title="放大" />
          <el-button @click="zoomOut" :icon="ZoomOut" title="缩小" />
          <el-button @click="fitView" :icon="FullScreen" title="适应画布" />
        </el-button-group>
        <el-button
          size="small"
          @click="showSaveDialog"
          :icon="FolderAdd"
          type="success"
          :disabled="!hasSelection"
          title="保存选中为公式模板"
        >
          保存公式
        </el-button>
        <el-button
          size="small"
          @click="deleteSelected"
          :icon="Close"
          type="warning"
          :disabled="!hasSelection"
          title="删除选中 (Delete键)"
        >
          删除选中
        </el-button>
        <el-button size="small" @click="clearGraph" :icon="Delete" type="danger" title="清空画布">清空</el-button>
      </div>

      <!-- 选中提示 -->
      <div v-if="hasSelection" class="absolute bottom-3 left-3 bg-blue-500 text-white px-3 py-1 rounded text-sm">
        已选中 {{ selectedCount }} 个元素 (按 Delete 键删除)
      </div>
    </div>

    <!-- 保存公式对话框 -->
    <el-dialog v-model="saveDialogVisible" title="保存公式模板" width="400px">
      <el-form :model="saveForm" label-width="80px">
        <el-form-item label="公式名称">
          <el-input v-model="saveForm.name" placeholder="例如：负载率计算" />
        </el-form-item>
        <el-form-item label="公式表达">
          <el-input v-model="saveForm.formula" placeholder="例如：(A ÷ B) × 100" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="saveForm.description" type="textarea" :rows="2" placeholder="公式用途说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="saveDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveFormula" :disabled="!saveForm.name">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { Graph } from '@antv/x6'
import { Selection } from '@antv/x6-plugin-selection'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { ZoomIn, ZoomOut, FullScreen, Delete, Close, FolderAdd } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { nanoid } from 'nanoid'
import { NODE_TYPES, NODE_CATEGORIES, DEFAULT_TEMPLATE } from '../templates/formulas'
import { registerCustomNodes, getGraphConfig, createNodeConfig } from '../utils/x6-config'

const emit = defineEmits(['graph-change', 'selection-change'])

const containerRef = ref(null)
const graph = ref(null)
const nodeTypes = NODE_TYPES
const nodeCategories = NODE_CATEGORIES
// 初始化为空数组，等加载完成后再填充
const templates = ref([])
const templatesLoading = ref(true)

// 切换标签
const activeTab = ref('template')
const currentTemplate = ref(null)

// 选中状态
const hasSelection = ref(false)
const selectedCount = ref(0)
const PASTE_OFFSET_STEP = 30
let clipboardCells = []
let pasteCount = 0

// 保存公式对话框
const saveDialogVisible = ref(false)
const saveForm = ref({
  name: '',
  formula: '',
  description: ''
})

// API 基础地址
const API_BASE = import.meta.env.DEV ? 'http://localhost:3006' : ''

// 从服务器加载模板数据
const loadTemplatesFromServer = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/templates`)
    if (response.ok) {
      const data = await response.json()
      return data
    }
  } catch (e) {
    console.warn('从服务器加载模板失败，使用本地存储:', e)
  }
  return null
}

// 保存模板数据到服务器
const saveTemplatesToServer = async () => {
  try {
    // 排除默认的"设计公式"，保存其他所有模板
    const templatesToSave = templates.value.filter(t => t.id !== 'custom')

    const response = await fetch(`${API_BASE}/api/templates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templates: templatesToSave })
    })

    if (response.ok) {
      console.log('模板数据已保存到服务器')
    }
  } catch (e) {
    console.warn('保存模板到服务器失败:', e)
  }
}

// 从服务器或 localStorage 加载公式模板
const loadCustomTemplates = async () => {
  try {
    templatesLoading.value = true

    // 优先从服务器加载
    const serverData = await loadTemplatesFromServer()

    let savedTemplates = []

    if (serverData) {
      // 使用服务器数据
      savedTemplates = serverData.templates || serverData.customTemplates || []

      // 同步到 localStorage 作为备份
      localStorage.setItem('formulaTemplates', JSON.stringify(savedTemplates))
    } else {
      // 回退到 localStorage
      const saved = localStorage.getItem('formulaTemplates')
      if (saved) {
        savedTemplates = JSON.parse(saved)
      }
    }

    // 设计公式始终在最前面，后面是从服务器加载的模板
    templates.value = [DEFAULT_TEMPLATE, ...savedTemplates]
  } catch (e) {
    console.error('加载公式模板失败:', e)
    // 出错时只显示默认的设计公式
    templates.value = [DEFAULT_TEMPLATE]
  } finally {
    templatesLoading.value = false
  }
}

// 初始化图形
onMounted(async () => {
  await loadCustomTemplates()
  nextTick(() => {
    initGraph()
  })
})

onUnmounted(() => {
  if (graph.value) {
    graph.value.dispose()
  }
})

// 选择模板
const selectTemplate = (tpl) => {
  currentTemplate.value = tpl
  if (graph.value) {
    loadTemplate(tpl)
  }
}

const initGraph = () => {
  if (!containerRef.value) return

  // 注册自定义节点
  registerCustomNodes()

  // 创建图形实例
  graph.value = new Graph(getGraphConfig(containerRef.value))

  // 使用选择插件
  graph.value.use(
    new Selection({
      enabled: true,
      multiple: true,
      rubberband: true,
      rubberEdge: true,
      movable: true,
      showNodeSelectionBox: true,
      showEdgeSelectionBox: true,
      pointerEvents: 'none'
    })
  )

  // 使用对齐线插件
  graph.value.use(
    new Snapline({
      enabled: true
    })
  )

  // 使用键盘插件
  graph.value.use(
    new Keyboard({
      enabled: true
    })
  )

  // 监听变化
  graph.value.on('node:added', emitChange)
  graph.value.on('node:removed', emitChange)
  graph.value.on('edge:connected', emitChange)
  graph.value.on('edge:removed', emitChange)
  graph.value.on('node:moved', emitChange)

  // 支持拖放
  containerRef.value.addEventListener('dragover', (e) => e.preventDefault())
  containerRef.value.addEventListener('drop', onDrop)

  // 监听选中状态变化
  graph.value.on('selection:changed', updateSelectionState)

  // 复制选中
  graph.value.bindKey(['ctrl+c', 'meta+c'], () => {
    copySelection()
    return false
  })

  // 粘贴
  graph.value.bindKey(['ctrl+v', 'meta+v'], () => {
    pasteSelection()
    return false
  })

  // 删除快捷键
  graph.value.bindKey(['delete', 'backspace'], () => {
    const cells = graph.value.getSelectedCells()
    if (cells.length) {
      graph.value.removeCells(cells)
      updateSelectionState()
    }
  })
}

// 拖拽开始
const onDragStart = (e, nodeType) => {
  e.dataTransfer.setData('nodeType', nodeType)
}

// 拖拽放下
const onDrop = (e) => {
  e.preventDefault()
  const nodeType = e.dataTransfer.getData('nodeType')
  if (!nodeType || !graph.value) return

  // 直接使用 clientX/clientY，让 X6 的 clientToLocal 处理坐标转换
  const point = graph.value.clientToLocal(e.clientX, e.clientY)

  addNode(nodeType, point)
}

// 需要配置点名的节点类型（IO 节点）
const IO_NODE_TYPES = ['MagusAI', 'MagusDI', 'AI', 'DI', 'AIEXP', 'MagusAO', 'MagusDO', 'LA', 'LD']

// 更新选中状态
const updateSelectionState = () => {
  const cells = graph.value?.getSelectedCells() || []
  hasSelection.value = cells.length > 0
  selectedCount.value = cells.length

  // 获取选中的 IO 节点 ID 列表
  const selectedNodes = cells.filter(cell => cell.isNode())
  const selectedIONodeIds = selectedNodes
    .filter(node => IO_NODE_TYPES.includes(node.getData()?.sysmbol))
    .map(node => node.id)

  // 发送选中变化事件
  emit('selection-change', selectedIONodeIds)
}

// 高亮指定节点（从左侧点名配置聚焦时调用）
const highlightNode = (nodeId) => {
  if (!graph.value || !nodeId) return

  // 先清除之前的高亮
  clearHighlight()

  const node = graph.value.getCellById(nodeId)
  if (node && node.isNode()) {
    // 选中该节点
    graph.value.select(node)
    // 将节点滚动到可视区域
    graph.value.scrollToCell(node, { animation: { duration: 300 } })
  }
}

// 清除高亮
const clearHighlight = () => {
  if (!graph.value) return
  graph.value.cleanSelection()
}

// 删除选中元素
const deleteSelected = () => {
  if (!graph.value) return
  const cells = graph.value.getSelectedCells()
  if (cells.length) {
    graph.value.removeCells(cells)
    updateSelectionState()
  }
}

// 复制选中的节点和连线
const copySelection = () => {
  if (!graph.value) return
  const cells = graph.value.getSelectedCells()
  if (!cells.length) return

  const cloned = graph.value.cloneSubGraph(cells)
  clipboardCells = Object.values(cloned)
  pasteCount = 0
}

// 粘贴到画布
const pasteSelection = () => {
  if (!graph.value || clipboardCells.length === 0) return

  const cloned = graph.value.cloneCells(clipboardCells)
  const cells = Object.values(cloned)
  if (!cells.length) return

  pasteCount += 1
  const offset = pasteCount * PASTE_OFFSET_STEP

  cells.forEach(cell => {
    if (cell.isNode()) {
      const pos = cell.getPosition()
      cell.setPosition(pos.x + offset, pos.y + offset)
    }
  })

  const nodes = cells.filter(cell => cell.isNode())
  const edges = cells.filter(cell => cell.isEdge())

  graph.value.addCell([...nodes, ...edges])
  graph.value.cleanSelection()
  graph.value.select([...nodes, ...edges])
  updateSelectionState()
  emitChange()
}

// 显示保存对话框
const showSaveDialog = () => {
  saveForm.value = { name: '', formula: '', description: '' }
  saveDialogVisible.value = true
}

// 保存公式到模板库
const saveFormula = () => {
  if (!graph.value || !saveForm.value.name) return

  const selectedCells = graph.value.getSelectedCells()
  const selectedNodes = selectedCells.filter(cell => cell.isNode())
  const selectedEdges = selectedCells.filter(cell => cell.isEdge())

  if (selectedNodes.length === 0) {
    ElMessage.warning('请至少选择一个节点')
    return
  }

  // 构建节点ID映射 (实际ID -> 模板ID)
  const idMap = {}
  const templateNodes = []

  // 计算选中节点的边界框，用于归一化位置
  let minX = Infinity, minY = Infinity
  selectedNodes.forEach(node => {
    const pos = node.getPosition()
    minX = Math.min(minX, pos.x)
    minY = Math.min(minY, pos.y)
  })

  // 转换节点
  selectedNodes.forEach((node, index) => {
    const nodeData = node.getData() || {}
    const pos = node.getPosition()
    const templateId = `node_${index + 1}`
    idMap[node.id] = templateId

    // 查找节点类型
    const nodeType = Object.keys(NODE_TYPES).find(key =>
      NODE_TYPES[key].sysmbol === nodeData.sysmbol
    )

    templateNodes.push({
      id: templateId,
      type: nodeType || 'MagusAI',
      label: node.attr('text/text') || nodeData.sysmbol,
      tagTemplate: nodeData.extends?.tag || '',
      position: {
        x: pos.x - minX + 100,
        y: pos.y - minY + 100
      }
    })
  })

  // 转换连线
  const templateEdges = []
  selectedEdges.forEach(edge => {
    const sourceCell = edge.getSourceCell()
    const targetCell = edge.getTargetCell()
    const sourcePortId = edge.getSourcePortId()
    const targetPortId = edge.getTargetPortId()

    if (sourceCell && targetCell && idMap[sourceCell.id] && idMap[targetCell.id]) {
      const sourcePort = sourceCell.getPort(sourcePortId)
      const targetPort = targetCell.getPort(targetPortId)

      templateEdges.push({
        source: idMap[sourceCell.id],
        target: idMap[targetCell.id],
        sourcePort: sourcePort?.data?.name || 'Y',
        targetPort: targetPort?.data?.name || 'X1'
      })
    }
  })

  // 创建新模板
  const newTemplate = {
    id: `custom_${Date.now()}`,
    name: saveForm.value.name,
    description: saveForm.value.description || '',
    formula: saveForm.value.formula || '',
    nodes: templateNodes,
    edges: templateEdges
  }

  // 添加到模板列表
  templates.value.push(newTemplate)

  // 保存到 localStorage
  saveTemplatesToStorage()

  ElMessage.success('公式已保存到模板库')
  saveDialogVisible.value = false
}

// 保存模板到 localStorage 和服务器
const saveTemplatesToStorage = () => {
  // 排除默认的"设计公式"，保存其他所有模板
  const templatesToSave = templates.value.filter(t => t.id !== 'custom')
  localStorage.setItem('formulaTemplates', JSON.stringify(templatesToSave))
  // 同时保存到服务器
  saveTemplatesToServer()
}

// 删除模板
const deleteTemplate = (tpl) => {
  // 设计公式不能删除
  if (tpl.id === 'custom') return

  // 从模板列表中移除
  const index = templates.value.findIndex(t => t.id === tpl.id)
  if (index > -1) {
    templates.value.splice(index, 1)

    // 如果删除的是当前选中的模板，切换到设计公式
    if (currentTemplate.value?.id === tpl.id) {
      currentTemplate.value = templates.value[0]
      if (graph.value) {
        loadTemplate(currentTemplate.value)
      }
    }

    // 保存到 localStorage 和服务器
    saveTemplatesToStorage()

    ElMessage.success(`已删除公式: ${tpl.name}`)
  }
}

// 添加节点
const addNode = (nodeType, position) => {
  const config = createNodeConfig(nodeType, { label: nodeType })
  if (!config) return

  const node = graph.value.addNode({
    ...config,
    id: nanoid(),
    x: position.x - config.width / 2,
    y: position.y - config.height / 2
  })

  // 为端口生成 ID
  const ports = node.getPorts()
  ports.forEach(port => {
    if (!port.id) {
      node.setPortProp(port.id, 'id', nanoid())
    }
  })

  return node
}

// 加载模板
const loadTemplate = (template) => {
  if (!graph.value) return

  // 清空画布
  graph.value.clearCells()

  if (!template || template.id === 'custom' || !template.nodes?.length) {
    emitChange()
    return
  }

  // 节点 ID 映射 (模板ID -> 实际ID)
  const idMap = {}

  // 添加节点
  template.nodes.forEach(node => {
    const config = createNodeConfig(node.type, node)
    if (!config) return

    const actualId = nanoid()
    idMap[node.id] = actualId

    const addedNode = graph.value.addNode({
      ...config,
      id: actualId,
      x: node.position.x,
      y: node.position.y
    })

    // 为端口设置 ID 并建立映射
    const ports = addedNode.getPorts()
    ports.forEach((port, index) => {
      const newPortId = nanoid()
      addedNode.setPortProp(port.id, 'id', newPortId)
      // 建立端口名称到ID的映射
      idMap[`${node.id}:${port.data?.name}`] = newPortId
    })
  })

  // 添加连线
  template.edges.forEach(edge => {
    const sourceNodeId = idMap[edge.source]
    const targetNodeId = idMap[edge.target]

    if (!sourceNodeId || !targetNodeId) return

    // 查找端口 ID
    const sourceNode = graph.value.getCellById(sourceNodeId)
    const targetNode = graph.value.getCellById(targetNodeId)

    const sourcePort = sourceNode?.getPorts().find(p => p.data?.name === edge.sourcePort)
    const targetPort = targetNode?.getPorts().find(p => p.data?.name === edge.targetPort)

    if (sourcePort && targetPort) {
      graph.value.addEdge({
        id: nanoid(),
        source: { cell: sourceNodeId, port: sourcePort.id },
        target: { cell: targetNodeId, port: targetPort.id },
        attrs: {
          line: {
            stroke: '#A2B1C3',
            strokeWidth: 2,
            targetMarker: {
              name: 'block',
              width: 12,
              height: 8
            }
          }
        },
        zIndex: 0
      })
    }
  })

  // 适配视图
  setTimeout(() => {
    graph.value.centerContent()
    graph.value.zoomToFit({ padding: 50, maxScale: 1 })
  }, 100)

  emitChange()
}

// 发送变化事件
const emitChange = () => {
  if (!graph.value) return

  const nodes = graph.value.getNodes().map(node => {
    const data = node.getData() || {}
    const ports = node.getPorts()
    return {
      id: node.id,
      position: node.getPosition(),
      size: node.getSize(),
      data: data,
      ports: ports,
      label: node.attr('text/text')
    }
  })

  const edges = graph.value.getEdges().map(edge => ({
    id: edge.id,
    source: edge.getSourceCell()?.id,
    sourcePort: edge.getSourcePortId(),
    target: edge.getTargetCell()?.id,
    targetPort: edge.getTargetPortId()
  }))

  emit('graph-change', { nodes, edges })
}

// 工具方法
const zoomIn = () => graph.value?.zoom(0.1)
const zoomOut = () => graph.value?.zoom(-0.1)
const fitView = () => {
  graph.value?.centerContent()
  graph.value?.zoomToFit({ padding: 50, maxScale: 1 })
}
const clearGraph = () => {
  graph.value?.clearCells()
  emitChange()
}

// 暴露方法给父组件
defineExpose({
  loadTemplate,
  getGraph: () => graph.value,
  clearGraph,
  highlightNode,
  clearHighlight
})
</script>

<style scoped>
.node-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.template-item .delete-btn {
  flex-shrink: 0;
}

.template-item:hover .delete-btn {
  opacity: 1;
}
</style>
