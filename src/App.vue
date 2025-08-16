<script setup>
import zh from 'element-plus/es/locale/lang/zh-cn.mjs'
</script>

<template>
  <el-config-provider :locale="zh">
    <div class="app">
      <router-view></router-view>
    </div>
  </el-config-provider>
  
</template>

<style scoped>

</style>
