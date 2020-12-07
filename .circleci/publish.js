const klaw = require('klaw-sync');
const path = require('path');
const fs = require('fs');
const ghpages = require('gh-pages');
const loader = require('speccy/lib/loader');

function filterFn (item) {
	const basename = path.basename(item.path);
	return basename === '.' || basename[0] !== '.' 
		&& basename !== 'node_modules' && basename !== 'fragments' && basename !== 'extensions'
}

let args = process.argv.slice(2);
let tag = 'dev';
if (args.length && args[0].trim().length > 0) {
	tag = args[0];
}

const options = {
	resolve: true,   // Resolve external references
	jsonSchema: true // Treat $ref like JSON Schema and convert to OpenAPI Schema Objects
  };

var folder = '.';
for (let file of klaw(folder, {filter: filterFn})) {
	if (!file.stats.isDirectory() && file.path.endsWith('openapi.yaml')) {
		let target = 'build' + path.sep + tag + path.sep + path.relative(folder, file.path);
		const dir = path.dirname(target)
		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir, {recursive: true});
		}
		console.log(target);
		loader
			.loadSpec(file.path, options)
			.then(spec => {
				fs.writeFileSync(target, JSON.stringify(spec))
			});
		
	}
}

/*
ghpages.publish('schemas/' + tag, {
	src: '**',
	dest: tag,
	message: 'Publish JSON Schemas [ci skip]',
	user: {
	  name: 'STAC CI',
	  email: 'ci@stacspec.org'
	}
}, error => {
	console.error(error ? error : 'Deployed to gh-pages');
	process.exit(error ? 1 : 0);
});
*/