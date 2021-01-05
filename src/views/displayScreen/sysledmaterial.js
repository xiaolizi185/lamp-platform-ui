import request from '@/utils/request'

const baseUrl = '/acloud-display'
const api = {
  addFile: 'acloud-file' + '/file/LEDMaterialAdd',
  updateMaObj: baseUrl + '/LEDMaterial/updateMaterial',
  getSysledmaterial: baseUrl + '/LEDMaterial/search',
  audit: baseUrl + '/LEDMaterial/passAudit',
  deleteMatObj: baseUrl + '/LEDMaterial/delete',
  uploadFile: '/acloud-file-center/file/oper/upload'
}
export function uploadFile(searchKey) {
  return request({
    url: api.uploadFile,
    method: 'post',
    data: searchKey
  })
}

export function addFile(searchKey) {
  return request({
    url: api.addFile,
    method: 'post',
    data: searchKey
  })
}

export function getSysledmaterial(searchKey, page, size) {
  return request({
    url: api.getSysledmaterial + '?page=' + page + '&size=' + size,
    method: 'post',
    data: searchKey
  })
}

export function audit(param) {
  return request({
    url: api.audit,
    method: 'post',
    data: param
  })
}

export function updateMaObj(param) {
  return request({
    url: api.updateMaObj,
    method: 'post',
    data: param
  })
}

export function deleteMatObj(param) {
  return request({
    url: api.deleteMatObj,
    method: 'post',
    data: param
  })
}
