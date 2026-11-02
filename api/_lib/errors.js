// Stops a request with a status and a message that is safe to show the user.
export const fail = (status, message) => {
  const err = new Error(message)
  err.status = status
  err.expose = true
  throw err
}
