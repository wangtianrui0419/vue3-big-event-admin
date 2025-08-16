<script setup>
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { artPublishService, artGetDetailService, artEditService } from '@/api/article'
import { baseURL } from '@/utils/request'
import axios from 'axios';

const visibleDrawer = ref(false)
// 默认数据
const defaultForm = {
  title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: ''
}
// 准备数据
const formModel = ref({ ...defaultForm })
const imageUrl = ref('')
const editorRef = ref()
const open = async (row) => {
  visibleDrawer.value = true
  if (row.id) {
    // 有id说明是编辑
    // 编辑回显
    const res = await artGetDetailService(row.id)
    formModel.value = res.data.data
    imageUrl.value = baseURL + formModel.value.cover_img
    // 提交给后台，需要的是 file 格式的，将网络图片，转成 file 格式
    // 网络图片转成 file 对象, 存储起来将来便于提交
    formModel.value.cover_img = await imageUrlToFile(imageUrl.value, formModel.value.cover_img)
  } else {
    // 每次点开抽屉都重置表单内容
    formModel.value = { ...defaultForm }
    imageUrl.value = ''
    editorRef.value.setHTML('')
  }
}
// 上传文件相关逻辑
const onSelectFile = (uploadFile) => {
  // 生成前端预览的图片文件，而不是直接提交到后台
  imageUrl.value = URL.createObjectURL(uploadFile.raw) 
  formModel.value.cover_img = uploadFile.raw
}

const emit = defineEmits(['success'])
const onPublish = async (state) => {
  formModel.value.state = state

  // 后台要求的是formData格式的数据，所以不能直接传递json对象
  const fd = new FormData()
  // formModel里面原本的每一项都要保留，用for循环遍历
  for ( let key in formModel.value ) {
    fd.append(key, formModel.value[key])
  }

  // 此处需要判断是编辑还是添加
  if (formModel.value.id) {
    await artEditService(fd)
    ElMessage.success('编辑成功！')
    visibleDrawer.value = false
    emit('success', 'edit')
  } else {
    // 无id说明是添加文章
    await artPublishService(fd)
    ElMessage.success('添加成功！')
    visibleDrawer.value = false
    // 要记得通知父组件，因为文章列表已经变化，渲染的问题要提交事件
    // 传递第二个参数作为标记，是添加文章
    emit('success', 'add')
  }
}

// 将网络图片地址转换为File对象
async function imageUrlToFile(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const imageData = response.data;

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], { type: response.headers['content-type'] });

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type });

    return file;
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error);
    throw error;
  }
}

defineExpose({
  open
})
</script>

<template>
  <el-drawer
    v-model="visibleDrawer"
    title="添加文章"
    :direction="direction"
    size="50%"
  >
    <el-form :model="formModel" class="form">
      <el-form-item label="文章标题" prop="title" >
        <el-input v-model="formModel.title" placeholder="请输入标题">
        </el-input>
      </el-form-item>
      <el-form-item prop="cate_id" label="文章分类" >
        <ChannelSelect v-model="formModel.cate_id" style="width: 100%"></ChannelSelect>
      </el-form-item>
      <el-form-item prop="cover_img" label="文章封面">
          <el-upload
            class="avatar-uploader"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="onSelectFile"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
      </el-form-item>
      <el-form-item prop="content" label="文章内容">
        <div class="editor">
          <QuillEditor
            ref="editorRef"
            v-model:content="formModel.content" 
            content-type="html"
            theme="snow"
          ></QuillEditor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onPublish('已发布')">发布</el-button>
        <el-button type="info" @click="onPublish('草稿')">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.form {
  margin: 0 4vh;
}
.avatar-uploader {
  border: 1px solid #dfdada;
  width: 178px;
  height: 178px;
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #aba6a6;
    text-align: center;
    width: 178px;
    height: 178px;
  }
}
.el-upload:hover {
  border-color: var(--el-color-primary);
}
.editor {
  width: 100%;
  // 由于Quill是作为子组件存在，普通scoped样式无法影响它，所以要用深度选择器:deep
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>