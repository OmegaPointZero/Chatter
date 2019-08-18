$(document).ready(function(){
    var server = 'ws://' + window.location.href.split('//')[1].split(':')[0]
    var ws = new WebSocket(server+':40510');
    // send message to server on connection
    ws.onopen = function () {
        console.log('websocket is connected ...')
        var time = new Date().getTime();
        var t = Date(t).split(' ')[4]
        ws.send(JSON.stringify({time:t, user:'customer', message:'customer connected'}))
    }

    $('#sendMessage').on('click', function(e){
        var message = $('#newChatMessage').val()
        var time = new Date().getTime();
        var t = Date(t).split(' ')[4]
        var msg = {
            time: t,
            user: 'customer',
            message: message
        }
        var m = JSON.stringify(msg)
        ws.send(m)
    })    

    ws.onmessage = (function(ev) {  
        var obj = JSON.parse(ev.data)
        console.log(obj)
        if(obj.status === "chatMessage" && obj.user ==="customer") {
            var html = "<div class=\"customerMessage\"><span class=\"selfInfo\">["+obj.time+"]:</span> "+obj.message+"</div><br>"  
            $('.chatItems').append(html)
        } else if(obj.status === "chatMessage" && obj.user ==="agent") {
            var html = "<div class=\"agentMessage\"><span class=\"otherInfo\">["+obj.time+"]:</span> "+obj.message+"</div><br>"  
            $('.chatItems').append(html)
        }
    })    
    
})
