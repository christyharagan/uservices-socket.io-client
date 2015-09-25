var uservices_1 = require('uservices');
function createLocalProxy(socket, serviceSpec, service) {
    uservices_1.visitService(serviceSpec, {
        onMethod: function (memberSchema) {
            var func = service[memberSchema.name];
            socket.on(memberSchema.name, function (args, cb) {
                func.apply(service, args).then(cb).catch(cb.bind(null, null));
            });
        },
        onEvent: function (memberSchema) {
            var name = memberSchema.name;
            var event = service[name];
            socket.on(name, function (args, cb) {
                var id = String(Date.now());
                cb(id);
                socket.once(name + id, function () {
                    event.apply(service, args).subscribe(function (value) {
                        socket.emit(name, [value]);
                    }, function (error) {
                        socket.emit(name, [null, error]);
                    }, function () {
                        socket.emit(name);
                    });
                });
            });
        }
    });
}
exports.createLocalProxy = createLocalProxy;
//# sourceMappingURL=localProxy.js.map