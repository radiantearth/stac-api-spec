const ghpages = require('gh-pages');


ghpages.publish('build/', {
	src: '**',
	message: 'Publish JSON Schemas [ci skip]',
	user: {
	  name: 'STAC CI',
	  email: 'ci@stacspec.org'
	}
}, error => {
	console.error(error ? error : 'Deployed to gh-pages');
	process.exit(error ? 1 : 0);
});