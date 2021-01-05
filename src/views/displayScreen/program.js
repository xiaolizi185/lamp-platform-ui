import request from '@/utils/request'

const baseUrl = '/acloud-display'
// getProgram: baseUrl + '/LedPlayList/getLedPlayListExtend',
const api = {
  getProgram: baseUrl + '/LedPlayList/getLEDMaterial',
  addProgram: baseUrl + '/LedPlayList/addLedPlayListExtend',
  updateProgram: baseUrl + '/LedPlayList/updateLedPlayListExtend',
  auditMultiply: baseUrl + '/LedPlayList/auditMultiply',
  getLedPlayListRef: baseUrl + '/LedPlayList/getLedPlayListRef',
  selectMaterial: baseUrl + '/LEDMaterial/selectMaterial',
  deletesysLeddevice: baseUrl + '/LEDDevice/delete',
  updatesysLeddevice: baseUrl + '/LEDDevice/update'
}

export function getProgram(param, page, size) {
  return request({
    url: api.getProgram + '?page=' + page + '&size=' + size,
    method: 'post',
    data: param
  })
}

export function addProgram(param) {
  return request({
    url: api.addProgram,
    method: 'post',
    data: param
  })
}

export function updateProgram(param) {
  return request({
    url: api.updateProgram,
    method: 'post',
    data: param
  })
}

export function deletesysLeddevice(param) {
  return request({
    url: api.deletesysLeddevice + '?id=' + param,
    method: 'post'
  })
}

export function updatesysLeddevice(param) {
  return request({
    url: api.updatesysLeddevice,
    method: 'post',
    data: param
  })
}

export function auditMultiply(param) {
  return request({
    url: api.auditMultiply,
    method: 'post',
    data: param
  })
}

export function selectMaterial(param) {
  return request({
    url: api.selectMaterial,
    method: 'post',
    data: param
  })
}

export function getLedPlayListRef(searchKey, page, size) {
  return request({
    url: api.getLedPlayListRef + '?searchKey=' + searchKey + '&page=' + page + '&size=' + size,
    method: 'get'
  })
}
