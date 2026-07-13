let invokeReceiverIdOffset = 0
const invokeReceivers = new Map()
const listenHandlers = new Map()

window.__ICMODS_RECEIVER__ || (window.__ICMODS_RECEIVER__ = {})

function throwUnsupportedError(message) {
  throw new Error(
    'Unable to launch in this environment. ' +
      'Please verify configuration issues and backend availability, then try again. ' +
      message,
  )
}

export function execute(cmd, args = {}) {
  if (window.__ICMODS_BRIDGE__ != null) {
    const payloadJson = window.__ICMODS_BRIDGE__.execute(cmd, JSON.stringify(args))
    const payload = JSON.parse(payloadJson)
    if (payload.error != null) {
      throw new Error(payload.error + ' (cmd=' + cmd + ')')
    }
    return payload.data
  }
  throwUnsupportedError('Calling bridge execute (cmd=' + cmd + ') without bridge!')
}

export async function invoke(cmd, args = {}) {
  if (window.__ICMODS_BRIDGE__ != null) {
    return new Promise((resolve, reject) => {
      const receiverId = cmd + '#' + invokeReceiverIdOffset++
      invokeReceivers.set(receiverId, { resolve, reject })
      window.__ICMODS_BRIDGE__.invoke(cmd, JSON.stringify(args), receiverId)
    })
  }
  throwUnsupportedError('Calling bridge invoke (cmd=' + cmd + ') without bridge!')
}

window.__ICMODS_RECEIVER__.invoke = (receiverId, payload) => {
  if (!invokeReceivers.has(receiverId)) {
    return
  }
  const { resolve } = invokeReceivers.get(receiverId)
  invokeReceivers.delete(receiverId)
  resolve(payload)
}

window.__ICMODS_RECEIVER__.reject = (receiverId, message) => {
  if (!invokeReceivers.has(receiverId)) {
    return
  }
  const { reject } = invokeReceivers.get(receiverId)
  invokeReceivers.delete(receiverId)
  reject(new Error(message + ' (id=' + receiverId + ')'))
}

export function listen(event, handler) {
  if (!listenHandlers.has(event)) {
    listenHandlers.set(event, [])
  }
  const handlers = listenHandlers.get(event)
  if (handlers.indexOf(handler) == -1) {
    handlers.push(handler)
  }
  return () => {
    const index = handlers.indexOf(handler)
    index == -1 || handlers.splice(index, 1)
  }
}

export function once(event, handler) {
  const unlisten = listen(event, (...args) => {
    unlisten()
    handler(...args)
  })
  return unlisten
}

export function emit(event, payload = {}) {
  if (window.__ICMODS_BRIDGE__ != null) {
    return window.__ICMODS_BRIDGE__.emit(event, JSON.stringify(payload))
  }
  throwUnsupportedError('Calling bridge emit (event=' + event + ') without bridge!')
}

window.__ICMODS_RECEIVER__.emit = (event, payload) => {
  if (!listenHandlers.has(event)) {
    return
  }
  const handlers = listenHandlers.get(event)
  for (const handler of handlers) {
    handler({ event, payload })
  }
}
