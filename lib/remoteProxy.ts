import {Spec, Observable, splitSpec} from 'uservices'
import {Observer, Subject} from 'rx'

export function createRemoteProxy<T>(socket: SocketIOClient.Socket, spec: Spec<T>) {
  let split = splitSpec(spec)
  let proxy: any = {}

  split.visit(function(name, action) {
    proxy[name] = socket.emit.bind(socket, name)
  }, function(name, func) {
    proxy[name] = function(...args: any[]) {
      return new Promise(function(resolve, reject) {
        socket.emit(name, args, function(value, error) {
          if (error) {
            reject(error)
          } else {
            resolve(value)
          }
        })
      })
    }
  }, function(name, event) {
    proxy[name] = function(...args: any[]) {
      let observer = new Subject()

      socket.emit(name, args, function(id: string) {
        socket.on(name + id, function([value, error, completed]) {
          if (completed) {
            observer.onCompleted()
          } else if (error) {
            observer.onError(value)
          } else {
            observer.onNext(value)
          }
        }).emit(name + id)
      })

        return observer
    }
  })

  return proxy
}
