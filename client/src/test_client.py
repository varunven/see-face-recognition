import socketio
import time

socket = socketio.Client()

# connect/disconnect


@socket.event
def connect():
    print('Connected to server')
    socket.emit("web-app-handler")


@socket.event
def disconnect():
    print('Disconnected from server')

# See Response


@socket.on('see-request')
def handle_see_response(data):
    print('Received see-request data:', data)


# Connect to the server
# server_url = 'http://localhost:3001'
server_url = 'https://7f46-2601-602-867f-c8d0-a8b4-eee3-ec61-e127.ngrok-free.app'
socket.connect(server_url)

# Send see-request
# request_data = {
#     'message': 'Hello, server!'
# }
# socket.emit('see-request', request_data)

# Keep the client running
socket.wait()
