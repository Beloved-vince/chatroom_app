import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private users: number = 0;

  handleConnection(client: Socket) {
    this.users++;
    this.server.emit('users', this.users);
  }

  handleDisconnect(client: Socket) {
    this.users--;
    this.server.emit('users', this.users);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
    client.emit('leftRoom', room);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: { room: string, message: string }) {
    this.server.to(payload.room).emit('message', payload.message);
  }
}
