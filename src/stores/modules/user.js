import { defineStore } from "pinia"
import { ref } from 'vue'
import { userGetInfoService } from '@/api/user'

export const useUserStore = defineStore('big-user', () => {
  const token = ref('')

  // 设置token
  const setToken = (newValue) => {
    token.value = newValue
  }

  // 移除token
  const removeToken = () => {
    token.value = ''
  }

  // 用户信息相关
  const userInfo = ref({})
  const getUserInfo = async () => {
    const res = await userGetInfoService()
    userInfo.value = res.data.data
  }
  const setUserInfo = (obj) => {
    userInfo.value = obj
  }
  const password = ref('')

  return {
    token,
    setToken,
    removeToken,
    userInfo,
    password,
    getUserInfo,
    setUserInfo
  }
},
  {
    // 持久化
    persist: true
  }
)