module.exports = (function(app,passport){
    
    // Agent Routes
    app.get('/', reqIsFromAgent, isAuthenticated, (req,res) => {
        res.render('agenthome.ejs', {user: req.user})
    })    

    app.get('/login', reqIsFromAgent, (req,res) =>{
        if(req.isAuthenticated()){
            res.redirect('/')
        } else {
            res.render('login.ejs')
        }
    })

    app.post('/login', reqIsFromAgent, notAuthenticated, passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login'
        })
    ); 
    app.post('/signup', reqIsFromAgent, notAuthenticated, passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/login'
        })
    ); 
    

    // Customer Routes
    app.get('/welcome', reqIsFromCustomer, (req,res) => {
        res.render('home.ejs')
    })    



    function isAuthenticated(req,res,next){
        if(req.isAuthenticated()){
            return next();
        } else {
            res.redirect('/login');
        }
    }

    function notAuthenticated(req,res,next){
        if(!req.isAuthenticated()){
            return next();
        } else {
            res.redirect('/');
        }
    }

    function reqIsFromAgent(req,res,next){
        var whitelist = process.env.AGENT_WHITELIST.split(',') 
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
