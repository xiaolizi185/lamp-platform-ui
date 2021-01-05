const __formatDate = (d, fmt) => {
  if (!d) {
    return ''
  }

  // trans number to date
  if (typeof d === 'number') {
    d = new Date(d)
  }

  if (!(d instanceof Date)) {
    return d
  }

  const o = {
    'M+': d.getMonth() + 1, // 月
    'd+': d.getDate(), // 日
    'h+': d.getHours() % 12 === 0 ? 12 : d.getHours() % 12, // 小时
    'H+': d.getHours(), // 小时
    'm+': d.getMinutes(), // 分
    's+': d.getSeconds(), // 秒
    'q+': Math.floor((d.getMonth() + 3) / 3), // 季度
    S: d.getMilliseconds() // 毫秒
  }

  const week = {
    '0': '\u65e5',
    '1': '\u4e00',
    '2': '\u4e8c',
    '3': '\u4e09',
    '4': '\u56db',
    '5': '\u4e94',
    '6': '\u516d'
  }

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (d.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }

  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (RegExp.$1.length > 1
        ? RegExp.$1.length > 2
          ? '\u661f\u671f'
          : '\u5468'
        : '') + week[d.getDay() + '']
    )
  }

  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }

  return fmt
}

const _isDate = p_value => {
  return p_value != null && p_value.constructor === Date
}

const __regex_yyyyM = /^(\S*)-(\S*)$/
const __regex_yyyyMD = /^(\S*)-(\S*)-(\S*)$/
const __regex_Hms = /^(\S*):(\S*):(\S*)$/
const __regex_Hm = /^(\S*):(\S*)$/

/**
 * <ul>
 * <li><b>parseDate(p_text)</b> - 将时间字符串转换为Date类型。
 * <p>
 * <b>参数：</b>
 * <ul>
 *     <li>p_text - 一个 Date 类型或字符串形式的日期值。</li>
 * </ul>
 * </p>
 *  * <p>
 * <b>示例：</b>
 * parseDate('2014-8-1 17:33:42')
 * </p>
 * </li>
 * </ul>
 */
const _parseDate = p_text => {
  if (p_text == null || (typeof p_text === 'string' && p_text.trim() === '')) {
    return null
  }
  if (_isDate(p_text)) {
    return p_text
  }

  let y = 1900
  let M = 1
  let d = 1
  let H = 0
  let m = 0
  let s = 0

  let parts = null
  let datePart = null
  let timePart = null
  p_text = p_text.trim()
  if (p_text.indexOf(' ') !== -1) {
    parts = p_text.split(' ')
  } else if (p_text.indexOf('T') !== -1) {
    parts = p_text.split('T')
  }

  if (parts == null) {
    parts = [p_text]
  }

  if (parts.length === 1) {
    if (parts[0].indexOf(':') !== -1) {
      timePart = parts[0]
    } else {
      datePart = parts[0]
    }
  } else if (parts.length === 2) {
    datePart = parts[0]
    timePart = parts[1]
  }

  if (datePart != null) {
    var matches = datePart.match(__regex_yyyyMD)
    if (matches == null) {
      matches = datePart.match(__regex_yyyyM)
      if (matches != null) {
        timePart = null
      } else {
        matches = [datePart, datePart]
      }
    }
    if (matches != null) {
      if (matches.length >= 2) {
        y = parseInt(matches[1], 10)
        if (isNaN(y)) {
          y = 1900
        }
      }

      if (matches.length >= 3) {
        M = parseInt(matches[2], 10)
        if (isNaN(M) || M > 12 || M <= 0) {
          M = 1
        }
      }

      if (matches.length >= 4) {
        var d_max = Date.getDaysInMonth(y, M - 1)
        d = parseInt(matches[3], 10)
        if (isNaN(d) || d <= 0) {
          d = 1
        } else if (d > d_max) {
          d = d_max
        }
      }
    }
  }

  if (timePart != null) {
    let matches = timePart.match(__regex_Hms)
    if (matches == null) {
      matches = timePart.match(__regex_Hm)
      if (matches == null) {
        matches = [timePart, timePart]
      }
    }

    if (matches.length >= 2) {
      H = parseInt(matches[1], 10)
      if (isNaN(H) || H > 23 || H < 0) {
        H = 0
      }
    }

    if (matches.length >= 3) {
      m = parseInt(matches[2], 10)
      if (isNaN(m) || m > 60 || m < 0) {
        m = 0
      }
    }

    if (matches.length >= 4) {
      s = parseInt(matches[3], 10)
      if (isNaN(s) || s > 60 || s < 0) {
        s = 0
      }
    }
  }

  return new Date(y, M - 1, d, H, m, s)
}

// 格式化日期
const _formatDate = (d, fmt) => {
  if (!fmt || typeof fmt !== 'string') {
    fmt = 'yyyy-MM-dd'
  }

  return __formatDate(d, fmt)
}

export default {
  format(d, fmt) {
    return _formatDate(d, fmt)
  },
  // 格式化日期，如2010-01-01
  formatDate(d) {
    return _formatDate(d, 'yyyy-MM-dd')
  },
  // 格式化时间，如12:00:00
  formatTime(d) {
    return _formatDate(d, 'HH:mm:ss')
  },
  // 格式化日期时间，如2010-01-01 12:00:00
  formatDateTime(d) {
    return _formatDate(d, 'yyyy-MM-dd HH:mm:ss')
  },
  // 格式化日期月份, 如2010-01
  formatMonth(d) {
    return _formatDate(d, 'yyyy-MM')
  },
  // 格式化日期小时，如2010-01-01 12:00
  formatHour(d) {
    return _formatDate(d, 'yyyy-MM-dd HH:mm')
  },

  parseDate(text) {
    return _parseDate(text)
  }
}
