<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { userUpdateInfoService } from '@/api/user'

const { userInfo: { id, username, nickname, email }, getUserInfo } = useUserStore()
const formRef = ref()

// 是在使用仓库中数据的初始值，无需响应式，所以可以解构
const form = ref({
  id,
  username, // 登录名称禁用，不可修改
  nickname,
  email,
})
const rules = {
  nickname: [
    { required: true, message: '昵称不能为空', trigger: 'blur' },
    { min: 2, max: 10, message: '昵称长度应为2-10个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' },
  ],
}
const submitForm = async () => {
  // 提交表单之前预校验
  await formRef.value.validate()
  await userUpdateInfoService(form.value)
  // 提交成功后更新仓库中的用户信息
  getUserInfo()
  ElMessage.success('用户信息更新成功')
}
</script>

<template>
    <PageContainer :title="'基本资料'">
      <!-- 表单部分 -->
       <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" class="form-container">
        <el-form-item label="登录名称" prop="username">
          <el-input v-model="form.username" :disabled="true" placeholder="登录名称" />
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交修改</el-button>
        </el-form-item>
      </el-form>
    </PageContainer>
</template>

<style lang="scss" scoped>
.form-container {
  width: 700px;
}
</style>