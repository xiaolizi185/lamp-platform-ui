<script>
import vue from 'vue'
import store from '../../store'
import querystring from 'querystring'

export default {
  name: 'AuthRedirect',
  data() {
    return {
      path: '/',
      query: {}
    }
  },
  created() {
    const response = vue.getAcloudProvider().parseResponse()
    if (response != null) {
      response.then(token => {
        store.commit('user/SET_TOKEN', token.access_token)
        let search = window.location.search
        if (search) {
          search = search.startsWith('?') ? search.substring(1) : search
          const queryObj = querystring.parse(search)
          if (queryObj.redirect) {
            this.path = queryObj.redirect
            this.query = this.getOtherQuery(queryObj)
          }
        }
        this.$router.push({ path: this.path, query: this.query })
      }).catch(e => {
        console.error(e)
      })
    } else {
      alert('非法的请求。')
    }
  },
  methods: {
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
