<template>
  <el-card class="template-selector" shadow="hover">
    <template #header>
      <div class="flex items-center gap-2">
        <el-icon><Collection /></el-icon>
        <span class="font-bold">公式模板</span>
      </div>
    </template>

    <div class="space-y-2">
      <div
        v-for="template in templates"
        :key="template.id"
        class="template-item p-3 rounded-lg cursor-pointer transition-all"
        :class="{
          'bg-blue-50 border-2 border-blue-500': currentTemplate?.id === template.id,
          'bg-gray-50 border-2 border-transparent hover:bg-gray-100': currentTemplate?.id !== template.id
        }"
        @click="selectTemplate(template)"
      >
        <div class="flex items-center justify-between">
          <span class="font-medium text-gray-800">{{ template.name }}</span>
          <el-tag v-if="template.id !== 'custom'" size="small" type="info">{{ template.formula }}</el-tag>
          <el-tag v-else size="small" type="warning">拖拽设计</el-tag>
        </div>
        <p class="text-sm text-gray-500 mt-1">{{ template.description }}</p>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { Collection } from '@element-plus/icons-vue'
import { TEMPLATES } from '../templates/formulas'

const props = defineProps({
  currentTemplate: Object
})

const emit = defineEmits(['select'])

const templates = ref(TEMPLATES)

const selectTemplate = (template) => {
  emit('select', template)
}
</script>

<style scoped>
.template-item {
  border: 2px solid transparent;
}
</style>
