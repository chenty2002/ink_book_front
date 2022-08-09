import request from '@/utils/request'
import { params } from 'svgo/plugins/prefixIds'

//post url?userId= + data.userId
export function createGroup(data) {
  return request({
    method: 'post',
    url: 'group/createGroup',
    data: data
  })
}

