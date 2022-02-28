## Contributing

Pull Requests are the primary method of contributing to the spec itself, and everyone is welcome to submit 
changes. Suggestions for changes to the core will be taken with higher priority if a clear implementation 
of STAC API has been built that can highlight the problem.

We consider everyone using the specification to catalog their data to be a 'contributor', as STAC is
really about the end result of more interoperable data, not just creating a spec for the sake of it.
So if you want to help then the best thing you can do is make new catalogs or build software that uses
the spec. And please do give us feedback. The best place to do so is on our 
[gitter channel](https://gitter.im/SpatioTemporal-Asset-Catalog/Lobby). If you are interested in helping
but aren't sure where to, then see the [stac-ecosystem](https://github.com/stac-utils/stac-ecosystem) repo
for ideas on projects to advance STAC. 

## Development Process

The SpatioTemporal Asset Catalog API specification is under active development. 

The `main` branch is a place of active development, 
where a new change in one part of the spec might not yet be fully updated everywhere else. Releases are tagged. The team uses the 
[stac-api-spec issue tracker](https://github.com/radiantearth/stac-api-spec/issues) to identify and track all that will be done for 
a release. Once all the major issues are resolved the core team makes sure everything is consistent across the spec and
examples.

### Submitting Pull Requests

Any proposed changes to the specification should be done as pull requests. Please make these
requests against the [main](https://github.com/radiantearth/stac-api-spec/tree/main) branch. 

Creating a Pull Request will show our PR template, which includes checkbox reminders for a number
of things, including adding an entry the [CHANGELOG](CHANGELOG.md) and making the PR against the `main`
branch. 

All pull requests should submit clean markdown, which is checked by the continuous integration
system. Please use `npm run check` locally, as described in the [next section](#check-files), 
to ensure that the checks on the pull request succeed. If it does not then you can look at the
mistakes online, which are the same as running `npm run check` locally would surface.

All pull requests that modify or create JSON schema files or examples should use
[JSON formatter](https://jsonformatter.org/) to keep files consistent across the repo. 

All pull requests additionally require a review of two STAC core team members.
Releases are cut from main.

### Check files

The same check-markdown and check-openapi programs that runs as a check on PR's is part of the repo and can be run locally. 
To install you'll need npm, which is a standard part of any [node.js installation](https://nodejs.org/en/download/).
Alternatively, you can also use [yarn](https://yarnpkg.com/) instead of npm. In this case replace all occurrences of `npm` with `yarn` below.

First you'll need to install everything with npm once. Just navigate to the root of the stac-spec repo and on 
your command line run:

```bash
npm install
```

Then to do the check for markdown and examples you run:

```bash
npm run check
```

This will spit out the same texts that you see online, and you can then go and fix your markdown or examples.

To just check the markdown, run:

```bash
npm run check-markdown
```

To just validate the OpenAPI definitions, run:

```bash
npm run check-openapi
```

### Working with the OpenAPI files

The definitive specification for STAC API is provided as an [OpenAPI](http://openapis.org/) 3.0 specification that is
contained within several YAML files in the various directories. These live in the same place as the markdown defining
various parts of the specification. Currently we expect developers to be up to speed with
OpenAPI and using their own tools to modify things. In the future we will provide tools to make it easier to work with.
There are html version of the OpenAPI files online at `https://api.stacspec.org/{version_number}` with `{version_number}` being the git tag or `dev`.

Often, updating
the JSON Schema and OpenAPI files is one of the harder aspects of creating a change, so please, don't
hesitate to ask for help in doing this!

## Release Process

To release a new version of the STAC spec the following list of tasks must be done. 

- **Update Issue Tracker**: Each release has a [milestone](https://github.com/radiantearth/stac-spec/milestones) in the github 
issue tracker, and before a release is done all open issues that are filed against it should be reviewed. All issues do not 
need to be completed, but the core release team should all review the issues to make sure that the critical ones for the 
release have been addressed. Issues that aren't seen as essential should be moved to future releases, so that there are no
open issues against the milestone.
- **Check dependencies**: STAC relies on OGC API - Features and STAC Core specifications at its core, and will likely rely
on additional Features API extensions as well as OGC API - Commons. We aim to always reference the latest version of these,
so before releasing we should check to make sure we are on the latest stable versions, and upgrade if it makes sense. We include
the latest stable STAC core spec version as a 'submodule', so before release we should update that to be the latest.
- **Agreement from core team**: The core STAC API team should meet (on video or on gitter) and decided that the release is ready.
This should include review of the issues, as well as looking at the spec holistically, to make sure the new changes keep
with a coherent whole.
- **Final Spec Read Through**: There should be a final read through of the core specification to make sure it makes sense
and there are no typos, errors, etc.
- **Update the Changelog**: The [changelog](CHANGELOG.md) should be reviewed to make sure it includes all major improvements
in the release. And anything in 'unreleased' section should move to the version of the spec to be released.
- **Check Online API Docs**: Check to make sure the online API docs reflect the release at <https://api.stacspec.org/> 
(this step may go away once we are confident this works well, as this publishing is in flux)
- **Release on Github**: The final step to create the release is to add a new 'release' on 
<https://github.com/radiantearth/stac-api-spec/releases>. This should use a tag like the others, with a 'v' prefix and then the 
release number, like v0.5.2. The changelog should be copied over to be the release notes, and then also include a link to 
the full milestone of everything closed in the issue tracker.
- **Promote the release**: A blog post and tweet should be composed and sent out, and then inform those in the gitter channel
to post / promote it.

### Release Candidates

Before any release that has *major* changes (made as a judgement call by the core contributors)  there should be a 'release 
candidate' to ensure the wider community of implementors can try it out
and catch any errors *before* a full release. It is only through actual implementations that we can be sure the new spec
version is good, so this step is essential if there are major changes. The release should proceed as normal, but called
vX.Y.Z-RC.1. The core STAC community should be told and encouraged to update their implementations. At least 2 implementations
should be updated to the new specification before there is a real release. And ideally an API client is also 
updated. This provides the core sanity check. If there are changes or fixes to the spec or 
schemas needed from their feedback then make fixes and do RC2. If it is just fixes to the examples or tooling then no 
additional RC is needed. After there is no more changes to spec or schemas then the release process should be done on main,
with no changes to the spec - just updating the version numbers.

## Governance 

The STAC API spec follows the same governance as the [core STAC spec](https://github.com/radiantearth/stac-spec/blob/master/process.md#governance).
