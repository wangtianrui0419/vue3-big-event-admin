<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { userUpdatePwdService } from '@/api/user'
import { useRouter } from 'vue-router'

// 提供数据
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})
const userStore = useUserStore()
const formRef = ref()
// 自定义校验规则
const checkConfirmPassword = (rule, value, callback) => {
  if (value !== pwdForm.value.new_pwd) {
    callback(new Error('两次输入的密码不一致！'))
  } else {
    // 一定不能忘了callback()
    callback()
  }
}
const checkNewPassword = (rule, value, callback) => {
  if (value === pwdForm.value.old_pwd) {
    callback(new Error('新密码不能与原密码相同！'))
  } else {
    // 一定不能忘了callback()
    callback()
  }
}

const checkOldPassword = async (rule, value, callback) => {
  if (value !== userStore.password) {
    callback(new Error('原密码输入错误！'))
    console.log(userStore.password)
  } else {
    // 一定不能忘了callback()
    callback()
  }
}
const rules = {
  old_pwd: [
    { required: true, message: '原密码不能为空', trigger: 'blur' },
    { min: 6, max: 15, message: '密码长度应为6-15个字符', trigger: 'blur' },
    {  validator: checkOldPassword, trigger: 'blur' }
  ],
  new_pwd: [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
    { min: 6, max: 15, message: '密码长度应为6-15个字符', trigger: 'blur' },
    { validator: checkNewPassword, trigger: 'blur' }
  ],
  re_pwd: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    { min: 6, max: 15, message: '密码长度应为6-15个字符', trigger: 'blur' },
    { validator: checkConfirmPassword, trigger: 'blur' }
  ],
}

const router = useRouter()
const submitForm = async () => {
  // 提交之前预校验
  await formRef.value.validate()
  await userUpdatePwdService(pwdForm.value)
  ElMessage.success('密码修改成功，请重新登录')
  userStore.password = pwdForm.value.new_pwd
  // 清空token和用户信息，并跳转到登录页重新登录
  userStore.setToken('')
  userStore.setUserInfo({})
  router.push('/login')
}
const resetForm = () => {
  formRef.value.resetFields()
  pwdForm.value = {
    old_pwd: '',
    new_pwd: '',
    re_pwd: ''
  }
}
</script>

<template>
  <PageContainer :title="'重置密码'">
     <el-form :model="pwdForm" :rules="rules" ref="formRef" label-width="100px" class="form-container">
      <el-form-item label="原密码" prop="old_pwd">
        <el-input v-model="pwdForm.old_pwd" type="password" show-password placeholder="请输入原密码" style="width: 100%" />
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd">
        <el-input v-model="pwdForm.new_pwd" type="password" show-password placeholder="请输入新密码" style="width: 100%" />
      </el-form-item>
      <el-form-item label="确认密码" prop="re_pwd">
        <el-input v-model="pwdForm.re_pwd" type="password" show-password placeholder="请再次输入新密码" style="width: 100%" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm" style="width: 48%">修改密码</el-button>
        <el-button @click="resetForm" style="width: 48%">重置</el-button>
      </el-form-item>
    </el-form>
  </PageContainer> 
</template>

<style lang="scss" scoped>
.form-container {
  width: 700px;
}
</style>