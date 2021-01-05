import AcloudProvider from '@acloud/acloud-oauth-client-js/src'
import Vue from 'vue'

const install = (Vue, options) => {
  const acloudProvider = new AcloudProvider(options || {})
  Vue.getAcloudProvider = () => {
    return acloudProvider
  }
}

Vue.use(install, {
  sso_uri_prefix: process.env.VUE_APP_SSO_URI_PREFIX ?
    process.env.VUE_APP_SSO_URI_PREFIX : process.env.VUE_APP_REST_URI_PREFIX + '/acloud-oauth',
  client_id: process.env.VUE_APP_CLIENT_ID
})
