const ghpages = require('gh-pages');

let args = process.argv.slice(2);
let tag = 'dev';
if (args.length && args[0].trim().length > 0) {
	tag = args[0];
}

ghpages.publish('build/', {
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