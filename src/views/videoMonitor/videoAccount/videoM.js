import request from '@/utils/request'

const baseUrl = '/acloud-lighting'
const api = {
  getVideoAccount: baseUrl + '/VideoCloudUser/getVideoCloudUser',
  addVideoAccout: baseUrl + '/VideoCloudUser/addVideoCloudUser',
  updateVideo: baseUrl + '/VideoCloudUser/updateVideoCloudUser',
  deleteVideo: baseUrl + '/VideoCloudUser/deleteMultiply',
  queryProject: baseUrl + '/SysProject/getProject',
  toGetToken: baseUrl + '/VideoCloudUser/getToken',
  queryVideoCloudUserAll: baseUrl + '/VideoCloudUser/getVideoCloudUserAll'
}

export function getVideoAccount(searchKey, page, size) {
  return request({
    url: api.getVideoAccount + '?page=' + page + '&size=' + size + '&searchKey=' + searchKey,
    method: 'get'
  })
}

export function addVideoAccout(param) {
  return request({
    url: api.addVideoAccout,
    method: 'post',
    data: param
  })
}

export function updateVideo(param) {
  return request({
    url: api.updateVideo,
    method: 'post',
    data: param
  })
}

export function deleteVideo(param) {
  return request({
    url: api.deleteVideo,
    method: 'post',
    data: param
  })
}

export function queryProject(searchKey, page, size) {
  return request({
    url: api.queryProject,
    method: 'get'
  })
}

export function toGetToken(param) {
  return request({
    url: api.toGetToken,
    method: 'post',
    data: param
  })
}

export function queryVideoCloudUserAll() {
  return request({
    url: api.queryVideoCloudUserAll,
    method: 'get'
  })
}
