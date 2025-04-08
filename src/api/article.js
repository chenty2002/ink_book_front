import request from '@/utils/request'


export function getGroupArticle(data) {
  return request({
    url: '/article/groupAll?groupId=' + data.groupId,
    method: 'get'
  })
}

export function saveArticle(data) {
    return request({
        url: '/article/save?groupId=' + data.groupId,
        method: 'post',
        data
    })
}

export function getArticleInfo(data) {
    return request({
        url: '/article/info?id=' + data.articleId,
        method: 'get'
    })
}

export function deleteArticle(data) {
    return request({
        url: '/article/delete?id=' + data.articleId,
        method: 'delete'
    })
}

export function updateArticle(data) {
    return request({
        url: '/article/update',
        method: 'post',
        data
    })
}

export function deleteGroupArticle(data) {
    return request({
        url: '/article/deleteGroup?groupId=' + data.groupId,
        method: 'delete'
    })
}

export function deleteProjectArticle(data) {
    return request({
        url: '/article/delete?projectId=' + data.projectId,
        method: 'delete'
    })
}

export function searchArticle(data) {
    return request({
        url: '/article/search?word=' + data.word,
        method: 'post',
        data
    })
}
