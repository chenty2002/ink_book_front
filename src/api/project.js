import request from '@/utils/request'

// 查询所有项目
// url: /groupProject?groupId=
export function getGroupProject(data) {
  return request({
    url: 'project/groupProject?groupId=' + data.groupId,
    method: 'get',
    data
  })
}

// 新建项目
// url: /newProject
export function newProject(data) {
  return request({
    url: '/project/newProject',
    method: 'post',
    data
  })
}

// 删除项目
// url: /deleteProject
export function deleteProject(data) {
  return request({
    url: '/project/deleteProject',
    method: 'delete',
    data
  })
}

// 编辑项目
// url: /modifyProject
export function modifyProject(data) {
  return request({
    url: '/project/modifyProject',
    method: 'post',
    data
  })
}

// 查询回收站所有项目
// url: /groupDeletedProject?groupId=
// sort: time1/time2/name1/name2/
export function getDeletedGroupProject(data) {
  return request({
    url: '/project/groupProject?groupId=' + data.groupId,
    method: 'get'
  })
}

// 搜索项目
// url: /search?word= &start= &end=
export function searchProject(data) {
  return request({
    url: '/project/search?word=' + data.word + (data.start === '' ? '' : ('&start=' + data.start)) + (data.end === '' ? '' : ('&end=' + data.end)),
    method: 'post',
    data
  })
}

export function restoreProject(data) {
  return request({
    url: '/project/restore',
    method: 'post',
    data
  })
}
