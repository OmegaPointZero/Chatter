const WebSocketServer = require('ws').Server;
wss = new WebSocketServer({port: 40510})

// all connections
var webSockets = {}

// agent and customer queue
var agents = []
var customers = []
// list of concurrent conversations (objects)
var conversations = []

wss.on('connection', function (webSocket, req) {
    var uid = Math.floor(new Date().getTime() * Math.random())
    webSockets[uid] = webSocket;

    webSocket.on('message', function (message) {
        var m = JSON.parse(message)
        var status = "";
        /* 
            connection logic: build a queue of waiting agents/customers
            when an agent connects, connect to fist available customer, and vice
            versa. If none available, add to queue. When two get connected, send
            them both each other's IDs to keep chats between only between them
        */
        if(m.message === "customer connected" && agents.length == 0){
            customers.push(uid)
        } else if (m.message === "customer connected" && agents.length > 0){
            status = 'connectionNotification'
            var agent = agents[0];
            agents = agents.splice(1, agents.length);
            var m1 = {
                agentID: agent,
                status: status,
                myID: uid
            }
            var customer = webSockets[uid]
            customer.send(JSON.stringify(m1))
            var m2 = {
                customerID: uid,
                status: status,
                myID: agent
            }
            var agent = webSockets[agent]
            var conversation = {
                agent: agent,
                customer: uid
            }
            conversations.push(conversation)
            agent.send(JSON.stringify(m2))
        } else if (m.message === "agent connected" && customers.length == 0){
            agents.push(uid)
        } else if (m.message === "agent connected" && customers.length > 0){ 
            status = 'connectionNotification'
            var cust = customers[0];
            customers.splice(1, customers.length);
            var m1 = {
                customerID: cust,
                status: status,
                myID: uid
            }
            console.log(`uid: ${uid}`)
            var agent = webSockets[uid]
            agent.send(JSON.stringify(m1))
            var m2 = {
                agentID: uid,
                status: status,
                myID: customer
            }
            var customer = webSockets[cust]
            var conversation = {
                agent: uid,
                customer: cust
            }
            conversations.push(conversation)
            customer.send(JSON.stringify(m2))
        } else {
            status = 'chatMessage'
            var target = webSockets[m.targetID]
            var msg = {
                target: m.targetID,
                source: this.uid,
                time: m.time,
                user: m.user,
                status: status,
                message: m.message
            }
            target.send(JSON.stringify(msg))
        }
    })

    webSocket.on('close', function(){
        console.log(`uid disconnected: ${uid}`)
        conversations.forEach(function(convo, i){
            if(convo.customer === uid){
                console.log('found matching convo:')
                console.log(convo)
                agents.push(convo.agent)
                var ag = webSockets[convo.agent]
                ag.send(JSON.stringify({'status':'customerDisconnect'}))
                conversations.splice(i,1)
            } else if(convo.agent === uid){
                console.log('found matching convo:')
                console.log(convo)
                var cs = webSockets[convo.customer]
                cs.send(JSON.stringify({'status':'agentDisconnect'}))
                conversations.splice(i,1)
            }
        })
        delete webSockets[uid]
    })

})

module.exports = (function(app,passport){
    
    // Agent Routes
    app.get('/', reqIsFromAgent, isAuthenticated, (req,res) => {
        res.render('agenthome.ejs', {user: req.user})
    })    

    app.get('/agentchat', reqIsFromAgent, isAuthenticated, (req,res) => {
        res.render('agentchat.ejs', {user: req.user})
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
    

    //General chat route
    app.post('/chat', function(req,res){
        wss.broadcast('message')      
    })

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
