export type OnEnterCallback = (event: React.KeyboardEvent<HTMLInputElement>) => void

export function onEnter(callback: () => void): OnEnterCallback {
  return async function(event: React.KeyboardEvent<HTMLInputElement>): Promise<void> {
    if( event.key !== "Enter" ) return
    callback()
  }
}
