<script setup>
import { messageConfig } from 'element-plus';
import { ref } from 'vue'
import { artAddChannelService, artEditChannelService } from '@/api/article'
const formModel = ref({
  cate_name: '',
  cate_alias: ''
})
const dialogVisible = ref(false)
const formRef = ref()
// 封装一个open方法
const open = async (row) => {
  dialogVisible.value = true
  formModel.value = { ...row }
}
// 向外暴露open方法
defineExpose({
  open
})
const rules = {
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { pattern: /^\S{1,10}$/, message: '分类名必须是1-10位的非空字符', trigger: 'blur' }
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类别名必须是1-15位的字母或数字', trigger: 'blur' }
  ]
}

// 通知父组件更改数据
const emit = defineEmits(['success'])
// 因为open()函数里面的row是包含id的，它把整个row赋值给formModel了
const handelSubmit = async () => {
  // 要记得提交之前再次校验！！绑定ref获取表单dom
  await formRef.value.validate()
  if (formModel.value.id) {
    // 有id说明是编辑
    await artEditChannelService(formModel.value)
  } else {
    // 没有id说明是添加
    await artAddChannelService(formModel.value)
  }
  ElMessage({
    type: 'success',
    message: formModel.value.id ? '编辑成功' : '添加成功'
  })

  dialogVisible.value = false
  emit('success')
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '编辑分类' : '添加分类'"
    width="500"
  >
    <el-form :model="formModel" ref="formRef" :rules="rules" label-width="100px" style="padding-right: 30px;">
      <el-form-item label="分类名称" prop="cate_name">
        <el-input v-model="formModel.cate_name"></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input v-model="formModel.cate_alias"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handelSubmit">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>