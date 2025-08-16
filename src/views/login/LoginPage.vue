<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { userRegisterService, userLoginService } from '@/api/user'
import { useUserStore } from '@/stores'
// 注意是从vue-router里面导方法，而不是导入自己写的router路由规则
import { useRouter } from 'vue-router'

const isRegister = ref(true)
const userStore = useUserStore()
const router = useRouter()

const formModel = ref({
  username: '',
  password: '',
  repassword: ''
})
// rules不是响应式的，不用ref
const rules = {
  username: [ // 规则数组名字要和formModel里面的属性名一致
    { required: true, message: '请输入用户名', trigger: 'change' },
    { min: 5, max: 10, message: '用户名必须是5-10位的字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'change' },
    { pattern: /^\S{6,15}$/, message: '密码必须是6-15位的字符', trigger: 'blur' }
  ],
  repassword: [
    { required: true, message: '请输入密码', trigger: 'change' },
    { pattern: /^\S{6,15}$/, message: '密码必须是6-15位的字符', trigger: 'blur' },
    // 自定义校验
    { 
      validator: (rules, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error('再次输入的密码不一致！'))
        } else { // 注意一定要写else，校验成功也要写
          callback()
        }
    },
      trigger: 'blur' 
    }
  ]
}


const form = ref()
const register = async () => {
  // 点击注册按钮时，进行预校验
  await form.value.validate() // 登录表单上面一定要绑定好了ref才可以
  await userRegisterService(formModel.value)
  ElMessage.success('注册成功')
  userStore.password = formModel.value.password
  isRegister.value = true
}
const login = async () => {
  // 预校验
  await form.value.validate()
  const res = await userLoginService(formModel.value)
  userStore.password = formModel.value.password
  userStore.setToken(res.data.token)
  ElMessage.success('登录成功！')
  router.push('/')
}

// 切换注册和登录的时候，不要把数据带过去：监视isRegister
watch(isRegister, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: ''
  }
})
</script>

<template>
  <el-row>
    <el-col class="left" :span="12">
    </el-col>
    <el-col :span="6" :offset="3" class="right">
      <!-- 登录表单 -->
      <el-form :model="formModel" :rules="rules" ref="form" size="large" v-if="isRegister">
        <el-form-item>
          <h2>登录</h2>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="formModel.username" :prefix-icon="User" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="formModel.password" show-password :prefix-icon="Lock" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item>
          <div class="footer">
            <!-- 要再套一个盒子 自己写的flex布局才生效 -->
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="login" type="primary" auto-insert-space class="btn">登录</el-button>
        </el-form-item>
        <el-form-item>
          <el-link :underline="false" @click="isRegister = false">注册 →</el-link>
        </el-form-item>
      </el-form>

      <!-- 注册表单 -->
      <el-form :model="formModel" :rules="rules" ref="form" size="large" v-else>
        <el-form-item>
          <h2>注册</h2>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="formModel.username" :prefix-icon="User" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="formModel.password" show-password type="password" :prefix-icon="Lock" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input v-model="formModel.repassword" show-password type="password" :prefix-icon="Lock" placeholder="请再次输入密码" />
        </el-form-item>
        <el-form-item>
          <el-button @click="register" type="primary" auto-insert-space class="btn">注册</el-button>
        </el-form-item>
        <el-form-item>
          <el-link :underline="false" @click="isRegister = true">← 返回</el-link>
        </el-form-item>
      </el-form>
    </el-col>
    </el-row>
</template>

<style lang="scss" scoped>
.left {
  height: 100vh;
  background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
              url('@/assets/login_bg.jpg') no-repeat center / cover;
  border-radius: 0 20px 20px 0;
}
h2 {
  margin: 0;
  padding: 0;
}
.right {
  display: flex;
  flex-direction: column;
  justify-content: center;
  user-select: none;
  .footer {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .btn {
    width: 100%;
  }
}     
</style>