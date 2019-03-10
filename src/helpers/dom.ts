export function onEnter<T>(callback: () => void): (event: React.KeyboardEvent<T>) => void {
  return async function(
    event: React.KeyboardEvent<T>
  ): Promise<void> {
    if (event.key !== "Enter") return
    callback()
  }
}
