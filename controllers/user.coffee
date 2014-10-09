express = require 'express'

View = require '../lib/view'
Main = require './user/main.coffee'

Router = express.Router()

Router.use (req, res, next) ->
	ie = (/MSIE ([0-9]{1,}[\.0-9]{0,})/g).exec req.headers['user-agent']
	if ie is null
		next()
	else
		version = parseFloat ie[0].replace('MSIE ', '')
		if version > 8
			next()
		else
			Main.ie req, res

Router.get '/', Main.index
Router.get '/simplePage/:id', Main.index
Router.get '/projects', Main.index

exports.Router = Router