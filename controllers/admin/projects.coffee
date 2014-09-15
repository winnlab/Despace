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
			Model 'Product', 'find', next, query, null, {sort: 'position'}
		(products)->
			View.clientSuccess {products}, res
	], (err)->
		setFail err, res



exports.save = (req, res) ->
	data = req.body
	_id = data._id

	async.waterfall [

		(next) ->
			if _id
				Model 'Product', 'findOne', next, {_id}
			else
				next null, null
		(product, next) ->
			if product
				product = Document.setDocumentData product, data
				product.save next
			else
				Model 'Product', 'create', next, data
		(product) ->
			View.clientSuccess _id: product._id, res
	], (err)->
		setFail err, res



exports.delete = (req, res) ->
	_id = req.params.id

	async.waterfall [
		(next) ->
			Model 'Product', 'findOne', next, {_id}
		(doc, next) ->
			if doc
				img = _.pick doc.img, imgTypes
				Files.unlinkArray _.values(img), uploadPath, (err) ->
					next err, doc
			else
				next "Продукт который Вы хотите удалить не существует."
		(doc, next) ->
			doc.remove next
		(next) ->
			View.clientSuccess 'Продукт успешно удален!', res
	], (err) ->
		setFail err, res



exports.imgSave = (req, res) ->
	_id = req.body.id
	imgName = req.body.name

	async.waterfall [
		(next) ->
			Model 'Product', 'findById', next, _id
		(product, next) ->
			Files.unlinkArray [product?.img?[imgName]], uploadPath, (err) ->
				next err, product
		(product, next) ->
			if req.files?[imgName]?.name
				product.img[imgName] = req.files[imgName].name

			product.save next
		(doc, numberAffected) ->
			View.clientSuccess name: doc.img[imgName], res
	], (err) ->
		setFail err, res



exports.imgDelete = (req, res) ->
	_id = req.body.id
	imgName = req.body.name

	async.waterfall [
		(next) ->
			Model 'Product', 'findOne', next, {_id}
		(product, next) ->
			Files.unlinkArray [product?.img?[imgName]], uploadPath, (err) ->
				next err, product
		(product, next) ->
			product.img[imgName] = undefined
			product.save next
		(doc, numberAffected) ->
			View.clientSuccess 'Картинка успешно удалена', res
	], (err) ->
		setFail err, res