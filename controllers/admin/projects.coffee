async = require 'async'
fs = require 'fs'

View = require '../../lib/view'
Files = require '../../lib/files'
Model = require '../../lib/model'
Logger = require '../../lib/logger'
_ = require 'underscore'

uploadPath = './uploads/'



setFail = (err, res) ->
	msg = "Error in #{__filename}: #{err.message or err}"
	Logger.log 'error', msg
	View.clientFail err, res


exports.findAll = (req, res) ->
	query = if req.query then req.query else {}
	async.waterfall [
		(next)->
			Model 'Project', 'find', next, query, null, {sort: 'position'}
		(projects)->
			View.clientSuccess {projects}, res
	], (err)->
		setFail err, res



exports.save = (req, res) ->
	data = req.body
	_id = data._id

	async.waterfall [

		(next) ->
			if _id
				Model 'Project', 'findOne', next, {_id}
			else
				next null, null
		(project, next) ->
			if project
				project = Document.setDocumentData project, data
				project.save next
			else
				Model 'Project', 'create', next, data
		(project) ->
			View.clientSuccess _id: project._id, res
	], (err)->
		setFail err, res



exports.delete = (req, res) ->
	_id = req.params.id

	async.waterfall [
		(next) ->
			Model 'Project', 'findOne', next, {_id}
		(doc, next) ->
			if doc
				Files.unlinkArray doc.img, uploadPath, (err) ->
					next err, doc
			else
				next "Проект который Вы хотите удалить не существует."
		(doc, next) ->
			doc.remove next
		(next) ->
			View.clientSuccess 'Проект успешно удален!', res
	], (err) ->
		setFail err, res



exports.imgSave = (req, res) ->
	_id = req.body.id
	imgName = req.body.name


	async.waterfall [
		(next) ->
			Model 'Project', 'findById', next, _id
#		(project, next) ->
#			Files.unlinkArray [project.img?[imgName]], uploadPath, (err) ->
#				next err, project
		(project, next) ->
			console.log req.files
			if req.files?[imgName]?.name
				console.log req.files.name
				project.img.push req.files[imgName].name

			project.save next
		(doc) ->
			View.clientSuccess name: req.files[imgName].name, res
	], (err) ->
		setFail err, res



exports.imgDelete = (req, res) ->
	_id = req.body.id
	imgName = req.body.name

	async.waterfall [
		(next) ->
			Model 'Project', 'findOne', next, {_id}
		(project, next) ->
			Files.unlinkArray [project?.img?[imgName]], uploadPath, (err) ->
				next err, project
		(project, next) ->
			project.img[imgName] = undefined
			project.save next
		(doc, numberAffected) ->
			View.clientSuccess 'Картинка успешно удалена', res
	], (err) ->
		setFail err, res