import request from '@/utils/request'

const baseUrl = '/acloud-trash'
const api = {
  gettrashCan: baseUrl + '/trashSensorDevice/search',
  addtrashCan: baseUrl + '/trashSensorDevice/add',
  deletetrashCan: baseUrl + '/trashSensorDevice/delete',
  updatetrashCan: baseUrl + '/trashSensorDevice/update'
}

export function gettrashCan(searchKey, page, size) {
  return request({
    url: api.gettrashCan + '?page=' + page + '&size=' + size,
    method: 'post',
    data: searchKey
  })
}

export function addtrashCan(param) {
  return request({
    url: api.addtrashCan,
    method: 'post',
    data: param
  })
}

export function deletetrashCan(param) {
  return request({
    url: api.deletetrashCan + '?id=' + param,
    method: 'post',
    data: param
  })
}

export function updatetrashCan(param) {
  return request({
    url: api.updatetrashCan,
    method: 'post',
    data: param
  })
}
