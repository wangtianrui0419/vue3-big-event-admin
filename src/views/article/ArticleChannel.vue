<script setup>
import { ref } from 'vue'
import { artGetChannelsService, artDelChannelService } from '@/api/article'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue'
import { ElMessageBox } from 'element-plus'

const channelList = ref([])
const loading = ref(false)
// 渲染分类列表函数
const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  loading.value = false
}
getChannelList()

const dialog = ref()
const onAddChannel = () => {
  dialog.value.open({})
}
const onEditChannel = (row) => {
  dialog.value.open(row)
}
const onDelChannel = async (row) => {
  // console.log(row, $index)
  await ElMessageBox.confirm('您确认要删除该文章分类吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '删除',
  })
  await artDelChannelService(row.id)
  getChannelList()
}
const handelSuccess = () => {
  getChannelList()
}
</script>

<template>
  <!-- 父传子传递标题 -->
  <PageContainer title="文章分类">
    <!-- 具名插槽传按钮 -->
    <template #extra>
      <el-button type="primary" @click="onAddChannel">添加分类</el-button>
    </template>
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column type="index" label="序号" width="120" />
      <el-table-column prop="cate_name" label="分类名称" />
      <el-table-column prop="cate_alias" label="分类别名" />
      <el-table-column label="操作" width="180">
        <template #default="{ row, $index }">
          <el-button
          :icon="Edit"
          type="primary"
          circle
          plain
          @click="onEditChannel(row)"
          ></el-button>
          <el-button
          :icon="Delete"
          type="danger"
          circle
          plain
          @click="onDelChannel(row, $index)"
          ></el-button>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty description="还没有文章分类" />
      </template>
    </el-table>
    <!-- 弹层 -->
    <ChannelEdit ref="dialog" @success="handelSuccess"></ChannelEdit>
  </PageContainer>
</template>

<style lang="scss" scoped>

</style>