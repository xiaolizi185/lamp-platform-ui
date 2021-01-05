import request from '@/utils/request'

const baseUrl = '/acloud-lighting'
const api = {
  getObjectEntity: baseUrl + '/SysDealList/getSysDealList',
  addObjectEntity: baseUrl + '/SysDealList/addDeal',
  deleteObjectEntity: baseUrl + '/environmentDev/deleteEnvironmentDev',
  updateObjectEntity: baseUrl + '/environmentDev/updateEnvironmentDev',
  auditPass: baseUrl + '/SysDealList/updateDeal'
}

export function getObjectEntity(page, size, obj) {
  return request({
    url: api.getObjectEntity + '?page=' + page + '&size=' + size,
    method: 'post',
    data: obj
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



export function auditPass(param) {
  return request({
    url: api.auditPass,
    method: 'post',
    data: param
  })
}
