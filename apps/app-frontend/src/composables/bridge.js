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

export async function invoke(cmd, args = {}) {
  if (window.icmodsBridge == null) {
    if (window.tauriApiCore == null) {
      window.tauriApiCore = await import('@tauri-apps/api/core')
    }
    return window.tauriApiCore.invoke(cmd, args)
  }
  return new Promise((resolve, reject) => {
    const callbackId = 'callback_' + callbackIdCounter++
    pendingCallbacks.set(callbackId, { resolve, reject })
    const paramsJson = JSON.stringify(args)
    window.icmodsBridge.invoke(cmd, paramsJson, callbackId)
  })
}

export async function getVersion() {
  if (window.icmodsBridge == null) {
    if (window.tauriApiCore == null) {
      window.tauriApiApp = await import('@tauri-apps/api/app')
    }
    return window.tauriApiCore.getVersion()
  }
  return window.icmodsBridge.getVersion()
}
