import { Service } from 'uservices';
export declare function createRemoteProxy<T>(socket: SocketIOClient.Socket, serviceSpec: Service<any, any>): any;
