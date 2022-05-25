const axios = require('axios')
const date = '5-January-2000'
axios.get(`https://jsonmock.hackerrank.com/api/stocks?date=${date}`)
.then(res => console.log(res.data))
.catch(err => console.log('Loi: ', err))