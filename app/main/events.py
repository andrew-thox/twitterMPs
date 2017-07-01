from flask import session
from flask_socketio import emit, join_room, leave_room
from .. import socketio


@socketio.on('joined')
def joined(message):
    """Sent by clients when they enter a room.
    A status message is broadcast to all people in the room."""
    print("JOINED")
    join_room('1234')
    emit('status',
         {'msg': session.get('name', 'annonoymous') + ' has entered the room.'},
         namespace='/',
         broadcast=True)


@socketio.on('text')
def text(message):
    """Sent by a client when the user entered a new message.
    The message is sent to all people in the room."""
    print("MESSAGE RECIEVED")
    print(message)
    emit('message', message, namespace='/', broadcast=True)


@socketio.on('left', namespace='/chat')
def left(message):
    """Sent by clients when they leave a room.
    A status message is broadcast to all people in the room."""
    room = session.get('room')
    leave_room(room)
    emit('status', {'msg': session.get('name') + ' has left the room.'}, room=room)
