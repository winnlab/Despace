express = require 'express'

View = require '../lib/view'

Main = require './admin/main'
SimplePage = require './admin/simplePages'

Router = express.Router()

#########################

Router.get '/', Main.index
Router.get '/login', Main.login
Router.get '/logout', Main.logout
Router.get '/dashboard', Main.dashboard

Router.post '/login', Main.doLogin

#----------------#

Router.get '/simplePage', SimplePage.findAll
Router.post '/simplePage', SimplePage.save
Router.put '/simplePage/:id?', SimplePage.save
Router.delete '/simplePage/:id?', SimplePage.delete

#----------------#

exports.Router = Router
exports.layoutPage = Main.dashboard