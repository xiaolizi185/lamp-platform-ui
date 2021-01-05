module.exports = {
  title: '智慧路灯管控平台',

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: true,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: false,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production',

  /**
   * 是否开启菜单权限过滤
   */
  enableMenuPermission: true,

  /**
   * 国密非对称公钥
   */
  publicKey: '040ECAE82EA6BDC5FF6C90E6D8700F4F9BD44224E8F7F7576FA9B17CE823C18DD5C1D4F9CBF4EE23B3D3347C589036EE13E9497607D0F6C7B5CC655D0D250EDCE8',

  /**
   * 防重放消息头是否添加开关
   */
  enablePreventRequestReplay: true,

  /**
   * 允许打开的最大菜单数
   */
  maxOpenMenuNumber: 10
}
