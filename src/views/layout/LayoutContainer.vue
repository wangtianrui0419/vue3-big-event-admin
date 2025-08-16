<script setup>
import { Management, Promotion, UserFilled, User, Crop, EditPen, CaretBottom, SwitchButton } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()
// 渲染完毕就调用
onMounted(() => {
  userStore.getUserInfo()
})

const avatar = ref('@/assets/default.png')

const handleCommand = async (key) => {
  if (key === 'logout') {
    // 注意！ElMessageBox返回的是一个promise对象 所以用async await 也可以把后面的逻辑放到then里面
    await ElMessageBox.confirm('您确认要退出登录吗？', '温馨提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
    // 退出操作
    userStore.setUserInfo({})
    userStore.removeToken()
    router.push('/login')
  } else {
    // 跳转操作
    router.push(`/user/${key}`)
  }
}
</script>

<template>
  <div class="app">
     <el-container class="layout-container">
      <!-- 左侧 -->
      <el-aside class="aside">
        <div class="img">
        </div>
        <el-menu
          default-active="/article/manage"
          class="el-menu-vertical-demo"
          active-text-color="#ffd04b"
          background-color="#333"
          text-color="#fff"
          router
        >
          <el-menu-item index="/article/channel">
            <el-icon><Management /></el-icon>
            <span>文章分类</span>
          </el-menu-item>
          <el-menu-item index="/article/manage">
            <el-icon><Promotion /></el-icon>
            <span>文章管理</span>
          </el-menu-item>
          <el-sub-menu index="3">
            <template #title>
              <el-icon><UserFilled /></el-icon>
              <span>个人中心</span>
            </template>
              <el-menu-item index="/user/profile">
                <el-icon><User /></el-icon>
                基本资料
              </el-menu-item>
              <el-menu-item index="/user/avatar">
                <el-icon><Crop /></el-icon>
                更换头像
              </el-menu-item>
              <el-menu-item index="/user/password">
                <el-icon><EditPen /></el-icon>
                重置密码
              </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <!-- 右侧 -->
      <el-container>
        <el-header class="header">
          <div class="name">
            程序员：<span>{{userStore.userInfo.nickname || userStore.userInfo.username}}</span>
          </div>
          <!-- 注意 @command="handleCommand"是要给整个dropdown加的 -->
          <el-dropdown class="dropdown"  @command="handleCommand">
            <span class="el-dropdown-link">
              <div class="default">
                <el-avatar :src="userStore.userInfo.user_pic || avatar" />
              </div>
              <el-icon><CaretBottom />
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  基本资料
                </el-dropdown-item>
                <el-dropdown-item command="avatar">
                  <el-icon><Crop /></el-icon>
                  更换头像
                </el-dropdown-item>
                <el-dropdown-item  command="password">
                  <el-icon><EditPen /></el-icon>
                  重置密码
                </el-dropdown-item>
                <el-dropdown-item command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-header>
        <el-main>
          <div class="bd">
            <router-view></router-view>
          </div>
        </el-main>
        <el-footer class="footer">大事件 ©2025 Created by 小王</el-footer>
      </el-container>
    </el-container>
  </div>
  
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
}
.aside {
  width: 26vh;
  background-color: #333;
  .img {
    height: 120px;
    // margin-top: 5vh;
    background: url('@/assets/logo.png') no-repeat center / 120px auto;
  }
  .el-menu-vertical-demo {
    // margin-top: 7vh;
    margin-left: 1vh;
  }
}
.header {
  display: flex;
  justify-content: space-between;
  height: 8vh;
  background-color: #fff;
  margin-right: 1vh;
  border-radius: 0 5px 5px 0;
  .name {
    line-height: 8vh;
    span {
      font-weight: 700;
    }
  }
  .dropdown {
    .default {
      // height: 100%;
      padding: 1vh;
    }
    .el-dropdown-link {
      display: flex;
      align-items: center;
      margin-right: 1vh;
      outline: none;
    }
  }
}
.bd {
  height: 100%;
  background-color: #fff;
}
.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}
</style>
