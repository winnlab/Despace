async = require 'async'
fs = require 'fs'

View = require '../../lib/view'
Files = require '../../lib/files'
Model = require '../../lib/model'
Logger = require '../../lib/logger'
Document = require '../../utils/document'
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
	_id = if req.params.id then req.params.id else req.body._id

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
		(project, next) ->
			if req.files?
				if Array.isArray req.files[imgName]
					req.files[imgName].forEach (val) ->
						project.img.push(val.name)
				else
					project.img.push(req.files[imgName].name)
			project.save next
		(doc) ->
			View.clientSuccess name: req.files[imgName], res
	], (err) ->
		setFail err, res

exports.imgDelete = (req, res) ->
	_id = req.body.id
	sourceName = req.body.sourceName

	async.waterfall [
		(next) ->
			Model 'Project', 'findOne', next, {_id}
		(project, next) ->
			index = project.img.indexOf(sourceName)
			fs.unlink uploadPath + project?.img?[index], (err) ->
						next err, project, index

		(project, index, next) ->
			project.img.splice index, 1
			project.save next
		(doc, numberAffected) ->
			View.clientSuccess 'Картинка успешно удалена', res
	], (err) ->
		setFail err, res