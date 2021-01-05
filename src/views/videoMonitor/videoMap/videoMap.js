import request from '@/utils/request'

const baseUrl = "/acloud-lighting"

const api = {
  
}

export function addVideoAccout(param) {
  return request({
    url: api.addVideoAccout,
    method:'post',
    data : param
  })
}