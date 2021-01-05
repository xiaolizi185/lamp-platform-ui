import axios from './request'

const downloadResponse = (response) => {
  const href = window.URL.createObjectURL(new Blob([response.data]), response.headers['content-type'])

  const contentDisposition = response.headers['content-disposition']
  const patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
  const result = patt.exec(contentDisposition)
  const filename = result[1]

  const downloadElement = document.createElement('a')
  downloadElement.style.display = 'none'
  downloadElement.href = href
  downloadElement.download = filename // 下载后文件名

  document.body.appendChild(downloadElement)
  downloadElement.click() // 点击下载

  document.body.removeChild(downloadElement) // 下载完成移除元素
  window.URL.revokeObjectURL(href) // 释放掉blob对象
}

const downloadBytes = (data) => {
  const downloadElement = document.createElement('a')
  downloadElement.style.display = 'none'
  downloadElement.href = data.href
  downloadElement.download = data.filename // 下载后文件名

  document.body.appendChild(downloadElement)
  downloadElement.click() // 点击下载

  document.body.removeChild(downloadElement) // 下载完成移除元素
}

const downlodRequest = (url, params) => {
  getBlobData(url, params).then(response => {
    downloadResponse(response)
  })
}

const getBlobData = (url, params) => {
  return axios.get(url, {
    params: params,
    responseType: 'arrayBuffer'
  }).then(response => {
    return response
  })
}

export {
  downloadResponse,
  downloadBytes,
  downlodRequest,
  getBlobData
}
