import request from '@/utils/request'

const api = {
  getStationAndAlert: '/acloud-lighting/stationAlert/getStationAlert'
}

export function getStationAndAlert(searchObj, page, size) {
  return request({
    url: api.getStationAndAlert + '?page=' + page + '&size=' + size,
    method: 'post',
    params: searchObj
  })
}

