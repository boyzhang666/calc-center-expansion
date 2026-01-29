<template>
  <el-card class="point-name-config flex-1" shadow="hover">
    <template #header>
      <div class="flex items-center gap-2">
        <el-icon><Edit /></el-icon>
        <span class="font-bold">点名配置</span>
      </div>
    </template>

    <div v-if="ioNodes.length === 0" class="text-gray-400 text-sm text-center py-4">
      请先选择公式模板或添加节点
    </div>

    <div v-else class="space-y-4">
      <!-- 输入节点配置 -->
      <div v-if="inputNodes.length > 0">
        <h4 class="text-sm font-bold text-gray-600 mb-2 flex items-center gap-2">
          <el-tag type="primary" size="small">输入</el-tag>
          <span class="text-gray-400 font-normal">{{ inputNodes.length }} 个</span>
        </h4>
        <div class="space-y-3">
          <div
            v-for="node in inputNodes"
            :key="node.id"
            class="node-config"
            :class="{ 'node-highlighted': isNodeHighlighted(node.id) }"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium">{{ getNodeLabel(node) }}</span>
            </div>
            <el-input
              v-model="configs[node.id].tagTemplate"
              size="small"
              placeholder="点名模板，使用 {N} 作为编号占位符"
              @input="updateConfig"
              @focus="handleInputFocus(node.id)"
              @blur="handleInputBlur"
            >
              <template #prepend>点名</template>
            </el-input>
            <div v-if="node.data?.fixedTag" class="text-xs text-orange-500 mt-1">
              此节点点名固定，不随编号变化
            </div>
            <div v-if="node.data?.fixedIndex" class="text-xs text-blue-500 mt-1">
              此节点编号固定为 {{ String(node.data.fixedIndex).padStart(3, '0') }}
            </div>
          </div>
        </div>
      </div>

      <!-- 分隔线 -->
      <el-divider v-if="inputNodes.length > 0 && outputNodes.length > 0" />

      <!-- 输出节点配置 -->
      <div v-if="outputNodes.length > 0">
        <h4 class="text-sm font-bold text-gray-600 mb-2 flex items-center gap-2">
          <el-tag type="success" size="small">输出</el-tag>
          <span class="text-gray-400 font-normal">{{ outputNodes.length }} 个</span>
        </h4>
        <div class="space-y-3">
          <div
            v-for="node in outputNodes"
            :key="node.id"
            class="node-config"
            :class="{ 'node-highlighted': isNodeHighlighted(node.id) }"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium">{{ getNodeLabel(node) }}</span>
            </div>
            <el-input
              v-model="configs[node.id].tagTemplate"
              size="small"
              placeholder="点名模板，使用 {N} 作为编号占位符"
              @input="updateConfig"
              @focus="handleInputFocus(node.id)"
              @blur="handleInputBlur"
            >
              <template #prepend>点名</template>
            </el-input>
            <div v-if="node.data?.fixedTag" class="text-xs text-orange-500 mt-1">
              此节点点名固定，不随编号变化
            </div>
            <div v-if="node.data?.fixedIndex" class="text-xs text-blue-500 mt-1">
              此节点编号固定为 {{ String(node.data.fixedIndex).padStart(3, '0') }}
            </div>
          </div>
        </div>
      </div>

      <!-- 预览 -->
      <div v-if="previewTags.length" class="preview mt-4">
        <el-divider />
        <h4 class="text-sm font-bold text-gray-600 mb-2">点名预览 (前3个)</h4>
        <div class="bg-gray-50 rounded p-2 text-xs space-y-1 max-h-32 overflow-y-auto">
          <div v-for="(tag, index) in previewTags" :key="index" class="text-gray-600">
            {{ tag }}
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { ref, computed, watch, reactive } from 'vue'
import { Edit } from '@element-plus/icons-vue'

const props = defineProps({
  templateNodes: {
    type: Array,
    default: () => []
  },
  numberConfig: {
    type: Object,
    default: () => ({ start: 1, digits: 3 })
  },
  // 从画布选中的节点 ID 列表
  selectedNodeIds: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update', 'node-focus', 'node-blur'])

// 输入类型节点
const INPUT_TYPES = ['MagusAI', 'MagusDI', 'AI', 'DI', 'AIEXP', 'MagusAIStat', 'RedisAI']
// 输出类型节点
const OUTPUT_TYPES = ['MagusAO', 'MagusDO', 'LA', 'LD']
// 所有 IO 节点类型
const IO_TYPES = [...INPUT_TYPES, ...OUTPUT_TYPES]

// 节点配置
const configs = reactive({})

// 过滤出需要配置的 IO 节点
const ioNodes = computed(() => {
  return props.templateNodes.filter(n =>
    IO_TYPES.includes(n.data?.sysmbol)
  )
})

// 输入节点（按 Y 坐标排序）
const inputNodes = computed(() => {
  return props.templateNodes
    .filter(n => INPUT_TYPES.includes(n.data?.sysmbol))
    .sort((a, b) => (a.position?.y || 0) - (b.position?.y || 0))
})

// 输出节点（按 Y 坐标排序）
const outputNodes = computed(() => {
  return props.templateNodes
    .filter(n => OUTPUT_TYPES.includes(n.data?.sysmbol))
    .sort((a, b) => (a.position?.y || 0) - (b.position?.y || 0))
})

// 当前聚焦的节点 ID
const focusedNodeId = ref(null)

// 判断节点是否被选中（从画布选中或左侧聚焦）
const isNodeHighlighted = (nodeId) => {
  return focusedNodeId.value === nodeId || props.selectedNodeIds.includes(nodeId)
}

// 处理输入框聚焦
const handleInputFocus = (nodeId) => {
  focusedNodeId.value = nodeId
  emit('node-focus', nodeId)
}

// 处理输入框失焦
const handleInputBlur = () => {
  focusedNodeId.value = null
  emit('node-blur')
}

// 监听节点变化，初始化配置
watch(ioNodes, (nodes) => {
  nodes.forEach(node => {
    if (!configs[node.id]) {
      configs[node.id] = {
        tagTemplate: node.data?.extends?.tag || '',
        fixedIndex: node.data?.fixedIndex,
        fixedTag: node.data?.fixedTag
      }
    }
  })
  updateConfig()
}, { immediate: true, deep: true })

// 获取节点标签
const getNodeLabel = (node) => {
  return node.label || node.data?.sysmbol || '未命名'
}

// 生成预览点名
const previewTags = computed(() => {
  const tags = []
  const firstNode = ioNodes.value.find(n => !n.data?.fixedTag && !n.data?.fixedIndex)

  if (!firstNode || !configs[firstNode.id]?.tagTemplate) return tags

  for (let i = 0; i < 3; i++) {
    const num = props.numberConfig.start + i
    const paddedNum = String(num).padStart(props.numberConfig.digits, '0')
    const tag = configs[firstNode.id].tagTemplate.replace(/{N}/g, paddedNum)
    tags.push(`#${i + 1}: ${tag}`)
  }

  return tags
})

// 更新配置
function updateConfig() {
  emit('update', {
    nodeConfigs: { ...configs }
  })
}

// 暴露方法
defineExpose({
  getConfigs: () => ({
    nodeConfigs: configs
  })
})
</script>

<style scoped>
.node-config {
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.node-config.node-highlighted {
  background: #eff6ff;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>
