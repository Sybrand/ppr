import axios from '@/utils/axios-auth'

export default {
  /**
   * fetch config from API
   */
  fetchConfig() {
    // const url = `/${process.env.VUE_APP_PATH}/config/stub-configuration.json`
    const url = '/config/stub-configuration.json'
    const headers = {
      'Accept': 'application/json',
      'ResponseType': 'application/json',
      'Cache-Control': 'no-cache'
    }
    // console.log('Fetch config from ', url)

    return axios
      .get(url, {headers})
      .then(response => {
        const apiUrl = response.data['API_URL']
        axios.defaults.baseURL = apiUrl
        console.log('Set Base URL to: ' + apiUrl)

        const authUrl = response.data['AUTH_URL']
        sessionStorage.setItem('AUTH_URL', authUrl)
        console.log('Set Auth URL to: ' + authUrl)

        const authApiUrl = response.data['AUTH_API_URL']
        sessionStorage.setItem('AUTH_API_URL', authApiUrl)
        console.log('Set Auth API URL to: ' + authApiUrl)

        const payApiUrl = response.data['PAY_API_URL']
        sessionStorage.setItem('PAY_API_URL', payApiUrl)
        console.log('Set Pay API URL to: ' + payApiUrl)

        // TODO use this when ppr needs canada post address lookup.  Also need to fix the type checking error
        // Element implicitly has an 'any' type because index expression is not of type 'number'.
        // on the window['key'] statement
        // const addressCompleteKey = response.data['ADDRESS_COMPLETE_KEY']
        // window['addressCompleteKey'] = addressCompleteKey
        // console.log('Set Address Complete Key')
      })
  }
}
