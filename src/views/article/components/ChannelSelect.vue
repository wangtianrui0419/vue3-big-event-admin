<script setup>
import { ref } from 'vue'
import { artGetChannelsService } from '@/api/article'

defineProps({
  modelValue: {
    type: [String, Number]
  }
})
const emit = defineEmits(['update:modelValue'])
const channelList = ref([])
const getChannel = async () => {
  const res = await artGetChannelsService()
  channelList.value = res.data.data
}
getChannel()
</script>

<template>
  <el-select
  :modelValue="modelValue"
  @update:modelValue="emit('update:modelValue', $event)"
  style="width: 200px"
  >
    <el-option
    v-for="channel in channelList"
    :key="channel.id"
    :label="channel.cate_name"
    :value="channel.id"></el-option>
  </el-select>
</template>