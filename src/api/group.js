import request from '@/utils/request'
// post url?userId= + data.userId
export function createGroup(data) {
  return request({
    method: 'post',
    url: 'group/createGroup',
    data: data
  })
}

export function getGroupList(data) {
  return request({
    method: 'get',
    url: 'group/getMyLeaderGroup?userId=' + data,
    data
  })
}

export function deleteGroup(data) {
  return request({
    url: 'group/deleteGroup?userId=' + data + '&groupId=' + data.groupId,
    method: 'post',
    data
  })
}
