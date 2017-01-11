var net = require('net');
var HOST = '127.0.0.1';
var PORT = 6379;
var server = net.createServer();

var RedisProtocol = require('./RedisProtocol');
const proto = new RedisProtocol();

var RedisCommand = require('./RedisCommand');

server.listen(PORT, HOST);

server.on('listening',function(){
  console.log('Server listening on ' + server.address().address + ':' + server.address().port);

});

server.on('connection', function(sock) {

    console.log('CONNECTED: ' +
         sock.remoteAddress +':'+ sock.remotePort);

    sock.on('data', function(data) {
        //console.log('DATA ' + sock.remoteAddress + ': ' + data);
        //sock.write("$6\r\nfoobar\r\n");
        proto.push(data);
        //console.log("last text:" + proto._text);
        //console.log("lines:" + proto._lines);
        while(proto.next()){
           //console.log('Test:' + proto.result.data); 
           const command = new RedisCommand(proto.result.data[0].toUpperCase(),proto.result.data.slice(1));
           const result = command.execute();
           //console.log(result);
           sock.write(result);
            
        }
    });

    sock.on('close', function(data) {
        console.log('CLOSED: ' +
            sock.remoteAddress + ' ' + sock.remotePort);
    });

     sock.on('error',function(err){
         consle.log('ERROR:' + err.code); 
     });

});
