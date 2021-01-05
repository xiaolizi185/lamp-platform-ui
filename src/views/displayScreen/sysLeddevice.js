import request from '@/utils/request'

const baseUrl = '/acloud-display'
const api = {
  getSysLeddevice: baseUrl + '/LEDDevice/search',
  addsysLeddevice: baseUrl + '/LEDDevice/add',
  deletesysLeddevice: baseUrl + '/LEDDevice/delete',
  updatesysLeddevice: baseUrl + '/LEDDevice/update',
  remoteSend: baseUrl + '/LEDDevice/remoteSend',
  sendLocal: baseUrl + '/LEDDevice/sendLocalUpdate',
  removeLocalUpdate: baseUrl + '/LEDDevice/removeLocalUpdate',
  getplayList: baseUrl + '/LEDDevice/getplayList',
  setPlayTimeList: baseUrl + '/LEDDevice/setPlayTimeList',
  getDeviceMemorySize: baseUrl + '/LEDDevice/getDeviceMemorySize',
  setRunOrStop: baseUrl + '/LEDDevice/setRunOrStop',
  getDevicePowerTimeList: baseUrl + '/LEDDevice/getDevicePowerTimeList',
  getAll:baseUrl + '/LEDDevice/findAll',
  openOrclose: baseUrl + '/LEDDevice/openOrClose',
  brightness: baseUrl + '/LEDDevice/brightness'
}

export function getSysLeddevice(searchKey, page, size) {
  return request({
    url: api.getSysLeddevice + '?page=' + page + '&size=' + size,
    method: 'post',
    data: searchKey
  })
}

export function addsysLeddevice(param) {
  return request({
    url: api.addsysLeddevice,
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


export function remoteSend(param) {
  return request({
    url: api.remoteSend,
    method: 'post',
    data: param
  })
}


export function sendLocal(param) {
  return request({
    url: api.sendLocal,
    method: 'post',
    data: param
  })
}



export function removeLocalUpdate(param) {
  return request({
    url: api.removeLocalUpdate,
    method: 'post',
    data: param
  })
}


export function getplayList(param) {
  return request({
    url: api.getplayList,
    method: 'post',
    data: param
  })
}


export function setPlayTimeList(param) {
  return request({
    url: api.setPlayTimeList,
    method: 'post',
    data: param
  })
}


export function getDeviceMemorySize(param) {
  return request({
    url: api.getDeviceMemorySize,
    method: 'post',
    data: param
  })
}


export function setRunOrStop(param) {
  return request({
    url: api.setRunOrStop,
    method: 'post',
    data: param
  })
}


export function getDevicePowerTimeList(param) {
  return request({
    url: api.getDevicePowerTimeList,
    method: 'post',
    data: param
  })
}


export function getAll(param) {
  return request({
    url: api.getAll,
    method: 'get'
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
