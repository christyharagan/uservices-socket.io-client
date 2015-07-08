import {visitSpec, Spec} from 'uservices'
import {Subject} from 'rx'
import * as s from 'typescript-schema'

export function createRemoteProxy<T>(socket: SocketIOClient.Socket, serviceSchema: Spec) {
  let proxy: any = {}

  visitSpec({
    onPromise: function(memberSchema) {
      let name = memberSchema.name
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
    },
    onObservable: function(memberSchema) {
      let name = memberSchema.name
      proxy[name] = function(...args: any[]) {
        let observer = new Subject()

        socket.emit(name, args, function(id: string) {
          socket.on(name + id, function([value, error, completed]) {
            if (completed) {
              observer.onCompleted()
            } else if (error) {
              observer.onError(error)
            } else {
              observer.onNext(value)
            }
          }).emit(name + id, true)
        })

        return observer
      }
    }
  },  /*Type Hack*/ <s.Class> serviceSchema)

  return proxy
}
