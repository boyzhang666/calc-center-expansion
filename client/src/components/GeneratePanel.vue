<template>
  <el-card class="generate-panel h-full" shadow="hover">
    <template #header>
      <div class="flex items-center gap-2">
        <el-icon><Setting /></el-icon>
        <span class="font-bold">生成配置</span>
      </div>
    </template>

    <div class="space-y-4">
      <!-- 编号规则 -->
      <div class="number-config">
        <h4 class="text-sm font-bold text-gray-600 mb-2">编号规则</h4>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="text-xs text-gray-500 flex items-center gap-1">起始编号</label>
            <el-input-number
              v-model="numberConfig.start"
              :min="1"
              :max="9999"
              class="w-full"
              @change="emitNumberConfig"
            />
          </div>
          <div>
            <label class="text-xs text-gray-500 flex items-center gap-1">
              位数(补零)
              <el-tooltip placement="top" effect="light">
                <template #content>
                  <div class="text-xs leading-relaxed">
                    <div class="font-bold mb-1">示例：起始编号=8，位数=4，模板=TANK_{N}_LEVEL</div>
                    <div>设备1：编号8 → <span class="text-blue-600">TANK_0008_LEVEL</span></div>
                    <div>设备2：编号9 → <span class="text-blue-600">TANK_0009_LEVEL</span></div>
                    <div>设备3：编号10 → <span class="text-blue-600">TANK_0010_LEVEL</span></div>
                  </div>
                </template>
                <el-icon class="cursor-help text-gray-400 hover:text-blue-500">
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </label>
            <el-input-number
              v-model="numberConfig.digits"
              :min="1"
              :max="6"
              class="w-full"
              @change="emitNumberConfig"
            />
          </div>
        </div>
      </div>

      <!-- 公式组数量 -->
      <div>
        <label class="text-sm font-medium text-gray-700 mb-2 block">公式组数量</label>
        <el-input-number
          v-model="deviceCount"
          :min="1"
          :max="1000"
          class="w-full"
        />
        <p class="text-xs text-gray-400 mt-1">将批量生成指定数量的公式组配置</p>
      </div>

      <!-- 文件名 -->
      <div>
        <label class="text-sm font-medium text-gray-700 mb-2 block">文件名</label>
        <el-input v-model="filename" placeholder="输出文件名">
          <template #append>.json</template>
        </el-input>
      </div>

      <el-divider />

      <!-- 统计信息 -->
      <div class="stats bg-gray-50 rounded-lg p-3">
        <h4 class="text-sm font-bold text-gray-600 mb-2">预计生成</h4>
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span class="text-gray-500">节点数:</span>
            <span class="font-bold text-blue-600 ml-2">{{ stats.nodeCount }}</span>
          </div>
          <div>
            <span class="text-gray-500">连线数:</span>
            <span class="font-bold text-blue-600 ml-2">{{ stats.edgeCount }}</span>
          </div>
          <div class="col-span-2">
            <span class="text-gray-500">总单元:</span>
            <span class="font-bold text-green-600 ml-2">{{ stats.totalCells }}</span>
          </div>
        </div>
      </div>

      <!-- 验证结果 -->
      <div v-if="validationErrors.length" class="validation-errors">
        <el-alert
          v-for="(error, index) in validationErrors"
          :key="index"
          :title="error"
          type="warning"
          :closable="false"
          show-icon
          class="mb-2"
        />
      </div>

      <!-- 操作按钮 -->
      <div class="actions flex gap-2">
        <el-button
          type="primary"
          size="large"
          class="flex-1"
          @click="generate"
          :disabled="!canGenerate"
          :icon="Download"
        >
          生成并下载
        </el-button>

        <el-button
          size="large"
          class="flex-1"
          @click="preview"
          :disabled="!canGenerate"
          :icon="View"
        >
          预览 JSON
        </el-button>
      </div>
    </div>

    <!-- 预览对话框 -->
    <el-dialog
      v-model="previewVisible"
      title="JSON 预览"
      width="80%"
      top="5vh"
    >
      <div class="preview-content">
        <el-input
          type="textarea"
          v-model="previewContent"
          :rows="25"
          readonly
          class="font-mono text-xs"
        />
      </div>
      <template #footer>
        <el-button @click="previewVisible = false">关闭</el-button>
        <el-button type="primary" @click="copyToClipboard" :icon="CopyDocument">
          复制到剪贴板
        </el-button>
        <el-button type="success" @click="downloadFromPreview" :icon="Download">
          下载
        </el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, computed, inject, watch, reactive, onMounted } from 'vue'
import { Setting, Download, View, CopyDocument, QuestionFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { generateJSON, validateGraphData } from '../utils/generator'

const props = defineProps({
  graphData: Object,
  pointConfigs: Object
})

const emit = defineEmits(['generate', 'number-config-change'])

// 从父组件获取编辑器引用
const editorRef = inject('editorRef')

// 编号配置
const numberConfig = reactive({
  start: 1,
  digits: 3
})

// 状态
const deviceCount = ref(1)
const filename = ref('output')
const previewVisible = ref(false)
const previewContent = ref('')
const validationErrors = ref([])
const currentTemplate = ref(null)

// 发送编号配置变化
const emitNumberConfig = () => {
  emit('number-config-change', { ...numberConfig })
}

// 初始化时发送一次
onMounted(() => {
  emitNumberConfig()
})

// 监听 graphData 变化以获取当前模板
watch(() => props.graphData, () => {
  // 可以从父组件传递模板信息
})

// 统计信息
const stats = computed(() => {
  if (!props.graphData || !props.graphData.nodes) {
    return { nodeCount: 0, edgeCount: 0, totalCells: 0 }
  }

  const nodesPerDevice = props.graphData.nodes.length
  const edgesPerDevice = props.graphData.edges?.length || 0

  return {
    nodeCount: nodesPerDevice * deviceCount.value,
    edgeCount: edgesPerDevice * deviceCount.value,
    totalCells: (nodesPerDevice + edgesPerDevice) * deviceCount.value
  }
})

// 是否可以生成
const canGenerate = computed(() => {
  const validation = validateGraphData(props.graphData)
  validationErrors.value = validation.errors
  return validation.valid
})

// 生成 JSON
const generate = () => {
  if (!canGenerate.value) {
    ElMessage.warning('请先修复验证错误')
    return
  }

  const jsonData = generateJSON(
    props.graphData,
    props.pointConfigs,
    deviceCount.value,
    currentTemplate.value
  )

  emit('generate', jsonData, `${filename.value}.json`)
}

// 预览 JSON
const preview = () => {
  if (!canGenerate.value) {
    ElMessage.warning('请先修复验证错误')
    return
  }

  const jsonData = generateJSON(
    props.graphData,
    props.pointConfigs,
    deviceCount.value,
    currentTemplate.value
  )

  previewContent.value = JSON.stringify(jsonData, null, 4)
  previewVisible.value = true
}

// 复制到剪贴板
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(previewContent.value)
    ElMessage.success('已复制到剪贴板')
  } catch (err) {
    ElMessage.error('复制失败')
  }
}

// 从预览下载
const downloadFromPreview = () => {
  emit('generate', JSON.parse(previewContent.value), `${filename.value}.json`)
}

// 暴露方法
defineExpose({
  generate,
  preview,
  setTemplate: (template) => {
    currentTemplate.value = template
  }
})
</script>

<style scoped>
.preview-content :deep(.el-textarea__inner) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.5;
}
</style>
