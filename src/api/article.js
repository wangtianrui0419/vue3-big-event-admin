import request from '@/utils/request'

// 分类相关
// 获取文章分类
export const artGetChannelsService = () => {
  return request.get('/my/cate/list')
}
// 编辑文章分类
export const artEditChannelService = (data) => {
  return request.put('/my/cate/info', data)
}
// 添加文章分类
export const artAddChannelService = (data) => {
  return request.post('/my/cate/add', data)
}
// 删除文章分类
export const artDelChannelService = (id) => {
  return request.delete('/my/cate/del', {
    params: {
      id
    }
  })
}

// 文章相关
// 获取文章列表
export const artGetListService = (params) => {
  return request.get('/my/article/list', {
    params: params
  })
}
// 添加文章
export const artPublishService = (formData) => {
  return request.post('/my/article/add', formData)
}
// 获取文章详情
export const artGetDetailService = (id) => {
  return request.get('/my/article/info', {
    params: {
      id: id
    }
  })
}
// 编辑文章
export const artEditService = (data) => {
  return request.put('/my/article/info', data)
}
// 删除文章
export const artDeleteService = (id) => {
  return request.delete('/my/article/info', {
    params: {
      id: id
    }
  })
}