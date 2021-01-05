
import { Sm3Utils } from '@acloud/acloud-smcrypto-js'
import qs from 'qs'

const type = function(o) {
  const s = Object.prototype.toString.call(o)
  return s.match(/\[object (.*?)\]/)[1].toLowerCase()
}

const array = ['Null', 'Undefined', 'Object', 'Array', 'String', 'Number', 'Boolean', 'Function', 'RegExp']

array.forEach(function(t) {
  type['is' + t] = function(o) {
    return type(o) === t.toLowerCase()
  }
})

/**
 * 将对象的属性进行排序，如果不是对象，直接返回
 * @param {*} data 排序的对象
 */
function sortKeys(data) {
  if (type.isObject(data)) {
    const obj = {}
    Object.keys(data).sort().forEach(key => {
      obj[key] = sortKeys(data[key])
    })
    return obj
  } else if (type.isArray(data)) {
    return data.map(el => sortKeys(el))
  } else {
    return data
  }
}

function getDataAsJson(config) {
  const query = queryParams(config)

  if (config.method === 'get') {
    if (query) {
      return paramsSerializer(query)
    } else {
      return null
    }
  } else {
    const body = config.data
    const data = {}
    if (body) {
      data.body = sortKeys(body)
    }
    if (query) {
      data.query = paramsSerializer(query)
    }
    return JSON.stringify(data)
  }
}

function queryParams(config) {
  let query = {}
  if (config.url.indexOf('?') !== -1) {
    query = Object.assign(query, qs.parse(config.url.substring(config.url.indexOf('?') + 1)))
  }
  if (config.params) {
    query = Object.assign(query, config.params)
  }
  return Object.keys(query).length === 0 ? null : query
}

/**
 * 序列化查询参数为字符串，进行排序，排除null值，不进行编码处理。
 * @param {*} params 查询参数
 */
function paramsSerializer(params) {
  return qs.stringify(params, { sort: (a, b) => a > b ? 1 : -1, skipNulls: true, encode: false })
}

/**
 * 为数据生成消息摘要
 * @param {url: '', data: '', headers: '', params: ''} config 需要生成消息摘要的数据，axios拦截器的config对象
 */
export function generateDataSign(config) {
  const str = getDataAsJson(config)
  if (str) {
    // SM2签名？
    const sign = Sm3Utils.encrypt(str)
    config.headers['X-Acloud-Data-Sign'] = sign
  }
}
