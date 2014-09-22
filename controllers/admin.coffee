express = require 'express'

View = require '../lib/view'

Main = require './admin/main'
SimplePage = require './admin/simplePages'

Project = require './admin/projects'

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

Router.get '/project', Project.findAll
Router.post '/project', Project.save
Router.put '/project/:id?', Project.save
Router.delete '/project/:id?', Project.delete

Router.post '/project/img', Project.imgSave

exports.Router = Router
exports.layoutPage = Main.dashboard