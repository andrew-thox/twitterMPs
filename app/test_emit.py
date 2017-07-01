from socketIO_client import SocketIO, LoggingNamespace

with SocketIO('localhost', 5000, LoggingNamespace) as socketIO:
    socketIO.emit('text', {'msg': 'external broadcast recieved'}, namespace='/', broadcast=True)
    socketIO.wait(seconds=1)
