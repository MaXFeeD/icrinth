let invokeReceiverIdOffset = 0
const invokeReceivers = new Map()
const listenHandlers = new Map()

window.__ICMODS_RECEIVER__ || (window.__ICMODS_RECEIVER__ = {})

export function execute(cmd, args = {}) {
  if (window.__ICMODS_BRIDGE__ != null) {
    return window.__ICMODS_BRIDGE__.execute(cmd, args)
  }
  throw new Error('Calling bridge.execute(' + cmd + ') without bridge!')
}

export async function invoke(cmd, args = {}) {
  if (window.__ICMODS_BRIDGE__ == null) {
    if (window.__TAURI_API_CORE__ == null) {
      window.__TAURI_API_CORE__ = await import('@tauri-apps/api/core')
    }
    return window.__TAURI_API_CORE__.invoke(cmd, args)
  }
  return new Promise((resolve, reject) => {
    const receiverId = cmd + '#' + invokeReceiverIdOffset++
    invokeReceivers.set(receiverId, { resolve, reject })
    window.__ICMODS_BRIDGE__.invoke(cmd, args, receiverId)
  })
}

window.__ICMODS_RECEIVER__.invoke = (receiverId, response) => {
  if (!invokeReceivers.has(receiverId)) {
    return
  }

  const { resolve, reject } = invokeReceivers.get(receiverId)
  invokeReceivers.delete(receiverId)

  if (response.status === 'success') {
    resolve(response.data)
  } else {
    reject(new Error(response.message + ' (' + receiverId + ')'))
  }
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
    return window.__ICMODS_BRIDGE__.emit(event, payload)
  }
  throw new Error('Calling bridge.emit(' + event + ') without bridge!')
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
