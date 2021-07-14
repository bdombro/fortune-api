import atob from 'atob'
import crypto from 'crypto'
import fortune from 'fortune'

import store from './store.js'

const { methods, errors, message } = fortune

const hashAlgorithm = 'SHA256'

export function makePassword (plainPassword) {
  const salt = crypto.randomBytes(32).toString('hex')
  const password = crypto
    .createHash(hashAlgorithm)
    .update(salt)
    .update('' + plainPassword)
    .digest()
    .toString('hex')

  return { salt, password }
}

export async function validateUser (context, maybeUserId) {
  const {
    request: { meta: { headers: { authorization }, language } },
    response: { meta }
  } = context

  if (!authorization) return {}
  
  // Parse HTTP Basic Access Authentication.
  const [ userName, plainPassword ] = atob(authorization.split(' ')[1]).split(':')

  if (!userName || !plainPassword) {
    if (!meta.headers) meta.headers = {}
    meta.headers['WWW-Authenticate'] = 'Basic realm="App name"'
    throw new errors.UnauthorizedError(message('InvalidAuthorization', language))
  }

  // const [user] = await store.adapter.find('user', [ userId ], { fields: { password: true, salt: true } })
  const user = (await store.adapter.find('user')).find(u => u.name === userName) || throwForbidden()

  const hash = crypto
    .createHash(hashAlgorithm)
    .update(user.salt)
    .update(plainPassword)
    .digest()

  // Prefer a constant-time equality check, this is not secure.
  if (!hash.equals(Buffer.from(user.password, 'hex'))) throwForbidden()

  return user
}

function throwForbidden() { throw new errors.ForbiddenError(message('InvalidPermission', language)) }