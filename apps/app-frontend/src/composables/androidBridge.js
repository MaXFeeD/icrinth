let callbackIdCounter = 0
const pendingCallbacks = new Map()

window.__icmodsBridgeInvokeCallback = (callbackId, response) => {
  if (pendingCallbacks.has(callbackId)) {
    const { resolve, reject } = pendingCallbacks.get(callbackId)
    pendingCallbacks.delete(callbackId)

    if (response.status === 'success') {
      resolve(response.data)
    } else {
      reject(new Error(response.message))
    }
  }
}

export function invoke(methodName, params = {}) {
  return new Promise((resolve, reject) => {
    const callbackId = 'callback_' + callbackIdCounter++
    pendingCallbacks.set(callbackId, { resolve, reject })
    const paramsJson = JSON.stringify(params)
    window.icmodsBridge.invoke(methodName, paramsJson, callbackId)
  })
}
