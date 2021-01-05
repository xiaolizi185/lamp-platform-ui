import request from '@/utils/request'

const baseUrl = '/acloud-lighting'
const api = {
  getSysOneKey: baseUrl + '/SysOneKey/getSysOneKey',
  addSysOneKey: baseUrl + '/SysOneKey/addSysOneKey',
  deleteSysOneKey: baseUrl + '/SysOneKey/deleteMultiply',
  updateSysOneKey: baseUrl + '/SysOneKey/updateSysOneKey'
}

export function getSysOneKey(searchKey, page, size) {
  return request({
    url: api.getSysOneKey + '?page=' + page + '&size=' + size + '&searchKey=' + searchKey,
    method: 'get'
  })
}

export function addSysOneKey(param) {
  return request({
    url: api.addSysOneKey,
    method: 'post',
    data: param
  })
}

export function deleteSysOneKey(param) {
  return request({
    url: api.deleteSysOneKey,
    method: 'post',
    data: param
  })
}

export function updateSysOneKey(param) {
  return request({
    url: api.updateSysOneKey,
    method: 'post',
    data: param
  })
}
