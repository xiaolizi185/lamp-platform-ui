import request from '@/utils/request'

const baseUrl = '/acloud-lighting'
const api = {
  getVideoEquipment: baseUrl + '/VideoHkInfo/getVideoHkInfo',
  addVideoHkInfo: baseUrl + '/VideoHkInfo/addVideoHkInfo',
  deleteVideoHKInfo: baseUrl + '/VideoHkInfo/deleteVideoHkInfo',
  updateVideoHkInfo: baseUrl + '/VideoHkInfo/updateVideoHkInfo'
}

export function getVideoEquipment(searchKey, page, size) {
  return request({
    url: api.getVideoEquipment + '?page=' + page + '&size=' + size + '&searchKey=' + searchKey,
    method: 'get'
  })
}

export function addVideoHkInfo(param) {
  return request({
    url: api.addVideoHkInfo,
    method: 'post',
    data: param
  })
}

export function deleteVideoHKInfo(param) {
  return request({
    url: api.deleteVideoHKInfo,
    method: 'post',
    data: param
  })
}

export function updateVideoHkInfo(param) {
  return request({
    url: api.updateVideoHkInfo,
    method: 'post',
    data: param
  })
}
