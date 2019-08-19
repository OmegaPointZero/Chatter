$(document).ready(function(){
    var server = 'ws://' + window.location.href.split('//')[1].split(':')[0]
    var ws = new WebSocket(server+':40510');
    var myID = "";
    var agentID = "";
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
            targetID: agentID,
            time: t,
            user: 'customer',
            message: message
        }
        ws.send(JSON.stringify(msg))
        var html = "<div class=\"customerMessage\"><span class=\"selfInfo\">["+t+"]:</span> "+message+"</div><br>"  
        $('.chatItems').append(html)
    })    

    $('textarea').on('click',function(e){
        var code = (e.keyCode ? e.keyCode : e.which);
        if(code==13){
            $('#sendMessage').click();
        }
    })

    ws.onmessage = (function(ev) {  
        var obj = JSON.parse(ev.data)
        console.log(obj)
        if(obj.status ==="connectionNotification") {
            myID = obj.myID;
            agentID = obj.agentID;
            $('#chatWindow').removeClass('hidden');
            $('.customerLoading').addClass('hidden');
            var html = "<div class=\"serverMessage\">You are now connected with an agent!</div>"
            $('.chatItems').append(html)
            $('textarea').attr('disabled',false)
        } else if(obj.status==="agentDisconnect"){
            $('textarea').attr('disabled','disabled')
            var html = "<div class=\"serverMessage\">The chat has been disconnected</div>"
            $('.chatItems').append(html)
        } else if(obj.status === "chatMessage" && obj.user ==="agent") {
            var html = "<div class=\"agentMessage\"><span class=\"otherInfo\">["+obj.time+"]:</span> "+obj.message+"</div><br>"  
            $('.chatItems').append(html)
        }
    })    
    
})
