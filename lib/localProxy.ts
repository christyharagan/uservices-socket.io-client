import {visitSpec, Spec} from 'uservices'
import {Observer, Observable} from 'rx'
import * as s from 'typescript-schema'

export function createLocalProxy<T>(socket: SocketIOClient.Socket, serviceSchema: Spec, service: T) {
  visitSpec({
    onPromise: function(memberSchema){
      let func = service[memberSchema.name]
      socket.on(memberSchema.name, function(args: any[], cb: (value?: any, error?: any) => void) {
        (<Promise<any>>func.apply(service, args)).then(cb).catch(cb.bind(null, null))
      })
    },
    onObservable: function(memberSchema) {
      let name = memberSchema.name
      let event = service[name]
      socket.on(name, function(args: any[], cb: (id: string) => void) {
        let id = String(Date.now())
        cb(id)
        socket.once(name + id, function() {
          (<Observable<any>>event.apply(service, args)).subscribe(
            function(value) {
              socket.emit(name, [value])
            },
            function(error) {
              socket.emit(name, [null, error])
            },
            function() {
              socket.emit(name)
            }
          )
        })
      })
    }
  },  /*Type Hack*/ <s.Class> serviceSchema)
}
