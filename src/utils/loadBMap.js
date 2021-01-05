/*
export default function loadBMap(ak) {
  return new Promise(function(resolve, reject) {
    if (typeof window.BMap !== 'undefined') {
      resolve(window.BMap)
      return true
    }
    window.onBMapCallback = function() {
      resolve(window.BMap)
    }
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src =
      'http://api.map.baidu.com/api?v=2.0&ak=uvN6vatvU44OQ0a9yuXdQZxTXODHGuLI&callback=onBMapCallback'
    script.onerror = reject
    document.head.appendChild(script)
  })
}
*/
