import request from '@/utils/request'

const baseUrl = '/acloud-lighting'
const api = {
  getWelllidDevice: baseUrl + '/WelllidDevice/getWelllidDevice',
  addWelllidDevice: baseUrl + '/WelllidDevice/addWelllidDevice',
  deleteWelllidDevice: baseUrl + '/WelllidDevice/deleteMultiply',
  updateWelllidDevice: baseUrl + '/WelllidDevice/updateWelllidDevice'
}

export function getWelllidDevice(param, page, size) {
  return request({
    url: api.getWelllidDevice + '?page=' + page + '&size=' + size,
    method: 'post',
    data: param
  })
}

export function addWelllidDevice(param) {
  return request({
    url: api.addWelllidDevice,
    method: 'post',
    data: param
  })
}

export function deleteWelllidDevice(param) {
  return request({
    url: api.deleteWelllidDevice,
    method: 'post',
    data: param
  })
}

export function updateWelllidDevice(param) {
  return request({
    url: api.updateWelllidDevice,
    method: 'post',
    data: param
  })
}
