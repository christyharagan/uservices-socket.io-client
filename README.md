Micro (u)Services - Socket.IO Client Proxies
==

Overview
--

Create remote proxies of [uServices](https://github.com/christyharagan/uservices) via socket.io. This package is for the client.

This is a fully-symmetric approach. In other words uServices on the client can be made available as remote proxies via the localProxy implementation.

Alternatively uServices on other tiers can be made available to the client via the remoteProxy implementation.

Usage
--

Install:
```
npm install uservices-socket.io.-server
```

Basic Usage: (see the uServices project for examples on how to create a uService spec)

```TypeScript
import * as io from 'socket.io-client'
import {createRemoteProxy} from 'uservices-socket.io-client'

let ioClient = io('http://localhost:8080')
let chatService = createRemoteProxy(ioClient, chatSpec)

```
