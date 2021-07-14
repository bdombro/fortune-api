'use strict'

import path from 'path'
import fortune from 'fortune'
// import adapter from 'fortune-seedable-memory'
import adapter from 'fortune-nedb'

import {User, userInput, userOutput} from './model/user.js'
import {Post, postInput} from './model/post.js'


const port= process.env.PORT || 8080

Object.assign(fortune.message.en, {
  'InvalidAuthorization': 'The given user and/or password is invalid.',
  'InvalidPermission': 'You do not have permission to do that.',
  'MissingField': 'The required field "{field}" is missing.'
})

const store = fortune(
	{
		user: User,
		post: Post,
	},
	{
		adapter: [adapter, {dbPath: path.resolve('./db')}],
		hooks: {
			user: [userInput, userOutput],
			post: [postInput],
		}
	}
)

export default store
