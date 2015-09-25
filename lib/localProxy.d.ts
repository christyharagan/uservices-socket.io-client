import { Service } from 'uservices';
export declare function createLocalProxy<T>(socket: SocketIOClient.Socket, serviceSpec: Service<any, any>, service: T): void;
