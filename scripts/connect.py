import logging
from socketIO_client import SocketIO, LoggingNamespace


logging.getLogger('socketIO-client').setLevel(logging.DEBUG)
logging.basicConfig()

with SocketIO('localhost', 5000, cookies={'session': 'x'}, session={'name': 'aaa'},) as socketIO:
    #socketIO.emit('joined', {}, namespace='/chat', broadcast=True, room='/chat')
    socketIO.emit('text', {'msg': "this message is from an external source"}, namespace='/chat', broadcast=True, room='/chat')
    socketIO.wait(seconds=5)
