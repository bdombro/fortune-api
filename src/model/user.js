import fortune from 'fortune'

import {makePassword, validateUser} from '../crypto.js'

const { methods, errors } = fortune

export const User = {
	name: String,
	password: String,
	salt: String,
	posts: [Array('post'), 'author'],
	following: [Array('user'), 'followers'],
	followers: [Array('user'), 'following'],
}

export function userInput (context, record, update) {
  const { request: { method, meta: { language } } } = context

  switch (method) {
		case methods.create:
			// Check for required fields.
			for (const field of [ 'name', 'password' ])
				if ((!field in record)) throw new errors.BadRequestError(
					message('MissingField', language, { field }))

			const { name, password } = record
			return Object.assign({ name }, makePassword(password))

		case methods.update:
			return validateUser(context, update.id).then(() => {
				if (update.replace) {
					// Only allow updates to name and password.
					const { replace: { name, password } } = update
					update.replace = { name }
					if (password) Object.assign(update.replace, makePassword(password))
				}

				// Only allow push/pull updates to follow and unfollow.
				if (update.push) update.push = { following: update.push.following }
				else if (update.pull) update.pull = { following: update.pull.following }
			})

		case methods.delete:
			return validateUser(context, record.id)
  }
}

export function userOutput (context, record) {
  delete record.password
  delete record.salt
}
