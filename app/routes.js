module.exports = (function(app,passport){
    
    // Agent Routes
    app.get('/', reqIsFromAgent, isAuthenticated, (req,res) => {
        res.render('agenthome.ejs', {user: req.user})
    })    

    app.get('/customerchat', reqIsFromAgent, isAuthenticated, (req,res) => {
        res.render('customerchat.ejs', {user: req.user})
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
    /* reqIsFromCustomer middleware commented out until deployment */
    app.get('/welcome', /* reqIsFromCustomer, */ (req,res) => {
        res.render('home.ejs')
    })    

    app.get('/chat/:category', /*reqIsFromCustomer,*/ (req,res) => {
        var category = req.params.category.toLowerCase();
        var categories = process.env.CATEGORIES.split(', ') 
        categories = categories.map(function(e) { return e.toLowerCase() })
        if(categories.indexOf(category) === -1){
            res.redirect('/welcome')
        } else {
            res.render('chat.ejs', {category:category})
        }
    });





    // Middlwares
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
