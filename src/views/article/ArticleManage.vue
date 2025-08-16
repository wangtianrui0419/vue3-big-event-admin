<script setup>
import { Edit, Delete } from '@element-plus/icons-vue'
import { ref } from 'vue'
import ChannelSelect from './components/ChannelSelect.vue'
import { artGetListService, artDeleteService } from '@/api/article'
import { formatDay } from '@/utils/format'
import ArticleEdit from './components/ArticleEdit.vue'

const params = ref({
  pagenum: 1, // 当前页码
  pagesize: 5, // 每页容纳多少条
  cate_id: '',
  state: ''
})
const artList = ref([])
const total = ref(0)
const loading = ref(false)
// 获取文章列表逻辑
const getArtList = async () => {
  loading.value = true

  const res = await artGetListService(params.value)
  artList.value = res.data.data
  total.value = res.data.total

  loading.value = false
}
getArtList()

// 分页逻辑
// 绑定的事件是可以拿到参数的
const onSizeChange = (size) => {
  // 每一页有几条数据已经是变化了，所以当前页很可能都不存在，重置回1
  params.value.pagenum = 1
  params.value.pagesize = size
  // 基于新的params重新渲染
  getArtList()
}
const onCurrentChange = (current) => {
  params.value.pagenum = current
  getArtList()
}

// 搜索和重置逻辑
const onSearch = () => {
  // 重置当前页到第一页
  params.value.pagenum = 1
  getArtList()
}
const onReset = () => {
  params.value.pagenum = 1
  params.value.cate_id = ''
  params.value.state = ''
  getArtList()
}

const articleEditRef = ref()
// 添加逻辑
const onAddArticle = () => {
  articleEditRef.value.open({})
}
// 编辑逻辑
const onEditArticle = (row) => {
  articleEditRef.value.open(row)
}
// 删除逻辑
const onDelArticle = async (row) => {
  await ElMessageBox.confirm('您确认要删除该文章吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '删除',
  })
  await artDeleteService(row.id)
  getArtList()
}

const onSuccess = (type) => {
  if ( type === 'add' ) {
    // 如果是添加文章，文章添加到最后，需要显示最后一页
    const lastPage = Math.ceil(( total.value + 1 ) / ( params.value.pagesize ))
    params.value.pagenum = lastPage
  }
  getArtList()
}

</script>

<template>
  <!-- 父传子传递标题 -->
  <PageContainer title="文章管理">
    <!-- 具名插槽传按钮 -->
    <template #extra>
      <el-button type="primary" @click="onAddArticle">添加文章</el-button>
    </template>
    <!-- 头部表单 -->
    <el-form inline>
      <el-form-item label="文章分类：">
        <ChannelSelect v-model="params.cate_id"></ChannelSelect>
      </el-form-item>
      <el-form-item label="发布状态：">
        <el-select v-model="params.state" style="width: 200px">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="artList" v-loading="loading">
      <el-table-column label="文章标题" prop="title">
        <!-- 通过插槽填充数据我们还可以自己拿到数据,并且自定义结构 -->
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间" prop="pub_date">
        <template #default="{ row }">
          {{ formatDay(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
          :icon="Edit"
          type="primary"
          circle
          plain
          @click="onEditArticle(row)"
          ></el-button>
          <el-button
          :icon="Delete"
          type="danger"
          circle
          plain
          @click="onDelArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
     <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 4, 5, 10]"
      :background="true"
      layout="jumper, total, sizes, prev, pager, next"
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: end;"
    />
    <!-- 抽屉 -->
    <ArticleEdit ref="articleEditRef" @success="onSuccess"></ArticleEdit>
  </PageContainer>
  
</template>

<style lang="scss" scoped>

</style>