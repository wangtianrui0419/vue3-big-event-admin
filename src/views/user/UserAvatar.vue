<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { Plus, Upload } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import { userUpdateAvatarService } from '@/api/user'

// 根据userStore里面的数据初始化imageURL的值
const imageUrl = ref('')
const uploadRef = ref()
const userStore = useUserStore()
imageUrl.value = userStore.userInfo.user_pic ? userStore.userInfo.user_pic : ''
const onSelectFile = (uploadFile) => {
  // 生成前端预览
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
  // 头像要求是base64字符串
  const reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = () => {
    // 图片转成base64字符串
    const base64Str = reader.result
    imageUrl.value = base64Str
  }
}
const onUpdateAvatar = async () => {
  await userUpdateAvatarService(imageUrl.value)
  await userStore.getUserInfo() // 更新store中的用户头像
  ElMessage.success('头像更新成功')
}
</script>

<template>
  <PageContainer :title="'更换头像'">
    <el-upload
      ref="uploadRef"
      class="avatar-uploader"
      :show-file-list="false"
      auto-upload="false"
      :on-change="onSelectFile"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
    <el-button 
      type="primary" 
      :icon="Plus" 
      size="large"
      @click="uploadRef.$el.querySelector('input').click()"
    >
    选择图片</el-button>
    <el-button
      type="success"
      :icon="Upload"
      size="large"
      @click="onUpdateAvatar"
    >
      上传头像
    </el-button>
  </PageContainer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  border: 1px solid #dfdada;
  width: 250px;
  height: 250px;
  margin-bottom: 20px;
  .avatar {
    width: 250px;
    height: 250px;
    display: block;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #aba6a6;
    text-align: center;
    width: 250px;
    height: 250px;
  }
}
</style>