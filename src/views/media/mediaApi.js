import request from '@/utils/request'

const baseUrl = '/acloud-broadcast'
const api = {
  getObjectEntity: baseUrl + '/mediaDir/findAll',
  addObjectEntity: baseUrl + '/mediaDir/addMediaDir',
  deleteObjectEntity: baseUrl + '/mediaDir/deleteMediaDir',
  updateObjectEntity: baseUrl + '/mediaDir/updateMediaDir',
  addFile: baseUrl + '/media/addMedia',
  getFileList: baseUrl + '/media/searchMedia',
  fileDelete: baseUrl + '/media/logicalDeletion'
}

export function getObjectEntity() {
  return request({
    url: api.getObjectEntity,
    method: 'get'
  })
}

export function addObjectEntity(param) {
  return request({
    url: api.addObjectEntity,
    method: 'post',
    data: param
  })
}

export function deleteObjectEntity(param) {
  return request({
    url: api.deleteObjectEntity + '/' + param,
    method: 'post',
    data: param
  })
}

export function updateObjectEntity(param) {
  return request({
    url: api.updateObjectEntity,
    method: 'post',
    data: param
  })
}

export function addFile(param) {
  return request({
    url: api.addFile,
    method: 'post',
    data: param
  })
}

export function getFileList(page, size, param) {
  return request({
    url: api.getFileList + '?page=' + page + '&size=' + size,
    method: 'post',
    data: param
  })
}


export function fileDelete(param) {
  return request({
    url: api.fileDelete + '?id=' + param,
    method: 'post'
  })
}
