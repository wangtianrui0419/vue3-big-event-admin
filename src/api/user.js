import request from '@/utils/request'

// 用户注册
export const userRegisterService = ({ username, password, repassword }) => {
  return request.post('/api/reg', { username, password, repassword })
}
// 用户登录
export const userLoginService = ({ username, password }) => {
  return request.post('/api/login', {
    username,
    password
  })
}
// 获取用户信息
export const userGetInfoService = (() => {
  return request.get('/my/userinfo')
})
// 更新用户信息
export const userUpdateInfoService = ({ id, nickname, email }) => {
  return request.put('/my/userinfo', { id, nickname, email })
}
// 更新用户头像
export const userUpdateAvatarService = (avatar) => {
  return request.patch('/my/update/avatar', {
    avatar: avatar
  })
}
// 更新用户密码
export const userUpdatePwdService = ({ old_pwd, new_pwd, re_pwd }) => {
  return request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })
}