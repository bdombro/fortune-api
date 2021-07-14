import fortune from 'fortune'
import {validateUser} from '../crypto.js'

const { methods, errors, message } = fortune

export const Post = {
	message: String,
	createdAt: Date,
	replies: [Array('post'), 'parent'],
	parent: [ 'post', 'replies' ],
	author: ['user', 'posts'],
}

export async function postInput (context, record, update) {
  const { request: { method, meta: { language } } } = context

  switch (method) {
  case methods.create:
    const currentUser = await validateUser(context)

		if (!currentUser.id) 
			throw new errors.ForbiddenError(message('InvalidPermission', language))
		
		record.createdAt = new Date()
		record.author = currentUser.id
		return record

  case methods.update:
    throw new errors.ForbiddenError(message('InvalidPermissions', language))

  case methods.delete:
    await validateUser(context, record.author)
  }
}