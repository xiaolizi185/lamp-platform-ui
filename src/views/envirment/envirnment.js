import request from '@/utils/request'

const baseUrl = '/acloud-lighting'
const api = {
  getObjectEntity: baseUrl + '/environmentDev/searchEnvironmentDev',
  addObjectEntity: baseUrl + '/environmentDev/addEnvironmentDev',
  deleteObjectEntity: baseUrl + '/environmentDev/deleteEnvironmentDev',
  updateObjectEntity: baseUrl + '/environmentDev/updateEnvironmentDev'
}

export function getObjectEntity(searchKey, page, size) {
  return request({
    url: api.getObjectEntity + '?page=' + page + '&size=' + size,
    method: 'post',
    data: searchKey
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
