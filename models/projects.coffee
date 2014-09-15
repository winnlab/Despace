mongoose = require 'mongoose'

ObjectId = mongoose.Schema.Types.ObjectId

ProjectSchemaFields =
	lang: [
		languageId:
			type: ObjectId
			ref: 'Language'
		name:
			type: String
			trim: true
		content:
			type: String
			trim: true
	]
	name:
		type: String
		trim: true
		required: true
	img:
		type: String
	content:
		type: String
		trim: true
	url:
		type: String
		trim: true
		required: true
	alternateView:
		type: String

options =
	collection: 'projects'

ProjectSchema = new mongoose.Schema ProjectSchemaFields, options

module.exports =  mongoose.model 'Project', ProjectSchema