import {Spec, Observable, splitService} from 'uservices'
import {Observer} from 'rx'

export function createLocalProxy<T>(socket: SocketIOClient.Socket, spec: Spec<T>, service: T) {
  let split = splitService(spec, service)

  split.visit(function(name, action) {
    socket.on(name, action)
  }, function(name, func) {
    socket.on(name, function(args: any[], cb: (value?: any, error?: any) => void) {
      (<Promise<any>>func.apply(service, args)).then(cb).catch(cb.bind(null, null))
    })
  }, function(name, event) {
    socket.on(name, function(args: any[], cb: (id: string) => void) {
      let id = String(Date.now())
      cb(id)
      socket.once(name + id, function() {
        (<Observable<any>>event.apply(service, args)).subscribe({
          onNext: function(value) {
            socket.emit(name, [value])
          },
          onError: function(error) {
            socket.emit(name, [null, error])
          },
          onCompleted: function() {
            socket.emit(name)
          }
        })
      })
    })
  })
}
