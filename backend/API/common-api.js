const exp = require('express')
const commonApp = exp.Router()
// no seperate calls for common-api
// So this is available for only apis and not for the entry point(server.js)


commonApp.get('',(req,res)=>{
    res.send({message: 'replied from common app'})
})


// export the commonApp
module.exports = commonApp