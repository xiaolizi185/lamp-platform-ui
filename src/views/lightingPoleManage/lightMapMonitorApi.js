import request from '@/utils/request'

const api = {
  getStationByLampId: '/acloud-lighting/station/query',
  getViewLedToLamp: '/acloud-display/ViewLedToLamp/getViewLedToLamp',
  openOrclose: '/acloud-display/LEDDevice/openOrClose',
  brightness: '/acloud-display/LEDDevice/brightness',
  getViewVideoToLamp: '/acloud-lighting/ViewVideoToLamp/getViewVideoToLamp',
  getTrashToLamp: '/acloud-lighting/TrashToLamp/getTrashToLamp',
  getManholeToLamp: 'acloud-lighting/ManholeToLamp/getManholeToLamp'
}

export function getViewLedToLamp(page, size, param) {
  return request({
    url: api.getViewLedToLamp + '?page=' + page + '&size=' + size,
    method: 'post',
    data: param
  })
}

export function getStationByLampId(page, size, param) {
  return request({
    url: api.getStationByLampId + '?page=' + page + '&size=' + size,
    method: 'post',
    data: param
  })
}
export function openOrclose(param) {
  return request({
    url: api.openOrclose,
    method: 'post',
    data: param
  })
}

export function brightness(param) {
  return request({
    url: api.brightness,
    method: 'post',
    data: param
  })
}
export function getViewVideoToLamp(page, size, param) {
  return request({
    url: api.getViewVideoToLamp + '?page=' + page + '&size=' + size,
    method: 'post',
    data: param
  })
}

export function getTrashToLamp(page, size, param) {
  return request({
    url: api.getTrashToLamp + '?page=' + page + '&size=' + size,
    method: 'post',
    data: param
  })
}
export function getManholeToLamp(page, size, param) {
  return request({
    url: api.getManholeToLamp + '?page=' + page + '&size=' + size,
    method: 'post',
    data: param
  })
}

