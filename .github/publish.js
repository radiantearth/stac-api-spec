const ghpages = require('gh-pages');

let args = process.argv.slice(2);
let tag = 'main';
if (args.length && args[0].trim().length > 0) {
	tag = args[0];
}

const options = {
	src: '**',
	dest: tag,
	message: 'Publish JSON Schemas [ci skip]',
	user: {
	  name: 'STAC CI',
	  email: 'ci@stacspec.org'
	}
};

// Use GITHUB_TOKEN for authentication in CI environment
if (process.env.GITHUB_TOKEN) {
	const repo = process.env.GITHUB_REPOSITORY || 'radiantearth/stac-api-spec';
	options.repo = `https://x-access-token:${process.env.GITHUB_TOKEN}@github.com/${repo}.git`;
}

ghpages.publish('build/', options, error => {
	console.error(error ? error : 'Deployed to gh-pages');
	process.exit(error ? 1 : 0);
});