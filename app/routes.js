module.exports = (function(app,passport){
    
    app.get('/', reqIsFromAgent, (req,res) => {
        res.render('agenthome.ejs')
    })    

    app.get('/welcome', reqIsFromCustomer, (req,res) => {
        res.render('home.ejs')
    })    

    function reqIsFromAgent(req,res,next){
        var whitelist = process.env.AGENT_WHITELIST.split(',') 
        console.log(`Here's your whitelist: ${whitelist}`)
        if(whitelist.indexOf(req.connection.remoteAddress) != -1){
            return next()
        } else {
            res.redirect('/welcome')
        }
    }    

    function reqIsFromCustomer(req,res,next){
        var whitelist = process.env.AGENT_WHITELIST.split(', ') 
        if(whitelist.indexOf(req.connection.remoteAddress) === -1){
            return next()
        }
    }    
})
