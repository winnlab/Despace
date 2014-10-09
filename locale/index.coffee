langs = [
    'ua'
    'en'
]

for lang in langs
    module.exports[lang] = require "./#{lang}"
