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
	img:
		type: Array
	url:
		type: String
		trim: true
		required: true
	position:
		type: String
		trim: true
	alternateView:
		type: String

options =
	collection: 'projects'

ProjectSchema = new mongoose.Schema ProjectSchemaFields, options

module.exports =  mongoose.model 'Project', ProjectSchema