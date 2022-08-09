import request from '@/utils/request'

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}
// sendmail发送邮件
export function sendEmail(data) {
  return request({
    url: '/user/sendEmail',
    method: 'post',
    data
  })
}

// 登录接口
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}
