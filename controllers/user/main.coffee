async = require 'async'
_ = require 'underscore'

View = require '../../lib/view'
Model = require '../../lib/model'
Auth = require '../../lib/auth'

locale = require '../../locale'

langs = null


filterLang = (array, languageId) ->
	_.map array, (el) ->
		el.lang = _.find el.lang, (lang) ->
			lang.language_id.toString() == languageId.toString()
		return el

mergeArrays = (origin, merged, originField, mergedField, resultField) ->
	_.map origin, (orig) ->
		_.each merged, (merg) ->
			orig[resultField] = merg if orig[originField].toString() == merg[mergedField].toString()
	return origin

getData = (req, lang, cb) ->
	async.parallel
		simplePages: (proceed) ->
			Model 'SimplePage', 'find', proceed
		projects: (proceed) ->
			Model 'Project', 'find', proceed

	, (err, data) ->
		return cb err if err
		data.user = if req.user then req.user else {}
		data.lang = if lang.default then '' else lang.isoCode
		data.langs = _.map langs, (lang)->
			return _.pick lang, 'isoCode', 'default'
		data.locale = locale[lang.isoCode]
		cb null, data

getQueryLang = (url, cb) ->
	# Todo change find lang to regExp
	queryString = url.split('/')[1]
	lang = _.findWhere langs, isoCode: queryString
	if lang
		cb null, lang
	else
		cb null, (_.findWhere langs, default: true)


exports.index = (req, res) ->
	async.waterfall [
		(next) ->
			if langs
				next null, langs
			else
				Model 'Language', 'find', next
		(docs, next) ->
			langs = docs
			getQueryLang req.originalUrl, next
		(lang, next) ->
			getData req, lang, next
		(data, next) ->
			View.render 'user/index', res, {data}
	], (err) ->
		res.send err

exports.ie = (req, res) ->
	View.render 'user/ie', res, {}

#exports.getAllProjects = (req, res) ->
#	query = if req.query then req.query else {}
#	async.waterfall [
#		(next)->
#			Model 'Project', 'find', next, query, null, {sort: 'position'}
#		(projects)->
#			View.clientSuccess {projects}, res
#	], (err)->
#		setFail err, res