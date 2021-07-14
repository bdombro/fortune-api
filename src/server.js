'use strict'

import http from 'http'
import fortune from 'fortune'
import fortuneHTTP  from 'fortune-http'
import jsonApiSerializer from 'fortune-json-api'

import store from './store.js'

const port= process.env.PORT || 8080

Object.assign(fortune.message.en, {
	'ForbiddenError': 'You are not allowed to do that.',
  'InvalidAuthorization': 'The given user and/or password is invalid.',
  'InvalidPermission': 'You do not have permission to do that.',
  'MissingField': 'The required field "{field}" is missing.'
})

const fortuneApp = fortuneHTTP(store,
	{
		serializers: [
			jsonApiSerializer,
			fortuneHTTP.JsonSerializer,
			// fortuneHTTP.HtmlSerializer,
			fortuneHTTP.FormDataSerializer,
			fortuneHTTP.FormUrlEncodedSerializer,
		]
	}
)

const server = http.createServer(fortuneApp)
server.listen(port)
