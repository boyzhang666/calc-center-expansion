<template>
  <div class="min-h-screen bg-gray-100">
    <!-- 顶部导航 -->
    <header class="bg-white shadow-sm">
      <div class="max-w-full mx-auto px-4 py-4 flex items-center justify-between">
        <h1 class="text-xl font-bold text-gray-800">计算中心 - 公式批量生成工具</h1>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="p-4">
      <div class="flex gap-4 h-[calc(100vh-100px)]">
        <!-- 左侧面板：点名配置 -->
        <div class="sidebar-container" :class="{ 'collapsed': leftCollapsed }">
          <div class="sidebar-content" v-show="!leftCollapsed">
            <PointNameConfig
              ref="pointNameConfigRef"
              :template-nodes="templateNodes"
              :number-config="numberConfig"
              :selected-node-ids="selectedNodeIds"
              @update="handlePointNameUpdate"
              @node-focus="handleNodeFocus"
              @node-blur="handleNodeBlur"
            />
          </div>
          <button
            class="sidebar-toggle left-toggle"
            @click="leftCollapsed = !leftCollapsed"
            :title="leftCollapsed ? '展开左侧面板' : '收起左侧面板'"
          >
            <el-icon :size="16">
              <ArrowLeft v-if="!leftCollapsed" />
              <ArrowRight v-else />
            </el-icon>
          </button>
        </div>

        <!-- 中间：X6 编辑器 -->
        <div class="flex-1 bg-white rounded-lg shadow overflow-hidden">
          <FormulaEditor
            ref="editorRef"
            @graph-change="handleGraphChange"
            @selection-change="handleSelectionChange"
          />
        </div>

        <!-- 右侧面板：生成控制 -->
        <div class="sidebar-container right" :class="{ 'collapsed': rightCollapsed }">
          <button
            class="sidebar-toggle right-toggle"
            @click="rightCollapsed = !rightCollapsed"
            :title="rightCollapsed ? '展开右侧面板' : '收起右侧面板'"
          >
            <el-icon :size="16">
              <ArrowRight v-if="!rightCollapsed" />
              <ArrowLeft v-else />
            </el-icon>
          </button>
          <div class="sidebar-content" v-show="!rightCollapsed">
            <GeneratePanel
              ref="generatePanelRef"
              :graph-data="graphData"
              :point-configs="pointConfigs"
              @generate="handleDownload"
              @number-config-change="handleNumberConfigChange"
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import PointNameConfig from './components/PointNameConfig.vue'
import FormulaEditor from './components/FormulaEditor.vue'
import GeneratePanel from './components/GeneratePanel.vue'

// 组件引用
const editorRef = ref(null)
const pointNameConfigRef = ref(null)
const generatePanelRef = ref(null)

// 侧边栏折叠状态
const leftCollapsed = ref(false)
const rightCollapsed = ref(false)

// 状态
const templateNodes = ref([])
const graphData = ref(null)
const numberConfig = ref({ start: 1, digits: 3 })
const pointConfigs = ref({
  nodeConfigs: {},
  numberConfig: { start: 1, digits: 3 }
})
// 画布中选中的 IO 节点 ID 列表
const selectedNodeIds = ref([])

// 需要配置点名的节点类型
const IO_NODE_TYPES = [
  // 输入块
  'MagusAI', 'MagusDI', 'AI', 'DI', 'AIEXP',
  // 输出块
  'MagusAO', 'MagusDO', 'LA', 'LD'
]

// 处理图形变化
const handleGraphChange = (data) => {
  graphData.value = data
  // 提取需要配置点名的节点（输入块和输出块）
  if (data && data.nodes) {
    templateNodes.value = data.nodes.filter(n =>
      IO_NODE_TYPES.includes(n.data?.sysmbol)
    )
  }
}

// 处理点名配置更新
const handlePointNameUpdate = (configs) => {
  pointConfigs.value = {
    ...configs,
    numberConfig: numberConfig.value
  }
}

// 处理编号配置变化
const handleNumberConfigChange = (config) => {
  numberConfig.value = config
  pointConfigs.value = {
    ...pointConfigs.value,
    numberConfig: config
  }
}

// 处理画布选中变化
const handleSelectionChange = (nodeIds) => {
  selectedNodeIds.value = nodeIds
}

// 处理左侧节点聚焦
const handleNodeFocus = (nodeId) => {
  editorRef.value?.highlightNode(nodeId)
}

// 处理左侧节点失焦
const handleNodeBlur = () => {
  editorRef.value?.clearHighlight()
}

// 下载文件
const handleDownload = (jsonData, filename) => {
  try {
    // 检查数据有效性
    if (!jsonData || !filename) {
      ElMessage.error('生成数据为空')
      console.error('jsonData:', jsonData, 'filename:', filename)
      return
    }

    // 直接在前端生成 Blob 下载
    const jsonString = JSON.stringify(jsonData, null, 4)
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()

    // 清理
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 100)

    ElMessage.success(`已下载 ${filename}`)
  } catch (error) {
    ElMessage.error('下载失败: ' + error.message)
    console.error('下载错误:', error)
  }
}

// 提供给子组件使用
provide('editorRef', editorRef)
</script>

<style scoped>
.sidebar-container {
  width: 320px;
  display: flex;
  flex-shrink: 0;
  position: relative;
  transition: width 0.3s ease;
}

.sidebar-container.collapsed {
  width: 24px;
}

.sidebar-container.right {
  flex-direction: row-reverse;
}

.sidebar-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
}

.sidebar-toggle {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 48px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: background-color 0.2s;
}

.sidebar-toggle:hover {
  background-color: #f3f4f6;
}

.left-toggle {
  right: -12px;
}

.right-toggle {
  left: -12px;
}

.sidebar-container.collapsed .left-toggle {
  right: 0;
}

.sidebar-container.collapsed .right-toggle {
  left: 0;
}
</style>
