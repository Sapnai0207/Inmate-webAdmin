
export const loadState = (key: string): any => {
  try {
    const serializedState = localStorage.getItem('state_' + key)
    if (serializedState == null) {
      return undefined
    }
    return JSON.parse(serializedState)
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export const saveState = (key: string, state: any): void => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('state_' + key, serializedState)
  } catch (error) {
    console.error(error)
  }
}

export const removeState = (key: string): void => {
  try {
    localStorage.removeItem('state_' + key)
  } catch (error) {
    console.error(error)
  }
}
