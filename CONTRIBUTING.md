# STAC API Development & Release Process

## Contributing

Anyone building software that catalogs imagery or other geospatial assets is welcome to collaborate.
Our goal is to be a collaboration of developers, not [architecture astronauts](http://www.joelonsoftware.com/articles/fog0000000018.html).

The best way to contribute is to try to implement the specification and give feedback on what worked
well and what could be improved. Any proposed changes to the specification should be done as pull requests. Ideally a
proposed change would also update all of the examples, but for now that is not required - the team
can validate and update all examples before a release. But it is recommended to update at least a
couple examples to reflect the change.

## Development Process

The SpatioTemporal Asset Catalog API specification is under active development. 

The `master` branch aims to always be stable, meaning that all the pieces of the specification are consistent and well
explained, and all the examples are consistent with the specification. The `dev` branch is a place of active development, 
where a new change in one part of the spec might not yet be fully updated everywhere else. The team uses the 
[stac-api-spec issue tracker](https://github.com/radiantearth/stac-api-spec/issues) to identify and track all that will be done for 
a release. Once all the major issues are resolved the core team makes sure everything is consistent across the spec and
examples.

### Submitting Pull Requests

Any proposed changes to the specification should be done as pull requests. Please make these
requests against the [`dev`](https://github.com/radiantearth/stac-api-spec/tree/dev) branch (this will
require you to switch from the default of 'master', which we keep so it displays first). 

Creating a Pull Request will show our PR template, which includes checkbox reminders for a number
of things.

- Adding an entry the [CHANGELOG](CHANGELOG.md). If the change is more editorial and minor then this 
is not required, but any change to the actual specification should definitely have one.
- Base the PR against dev, as mentioned above - even if the branch was made off of dev this reminds
you to change the base in GitHub's PR creation page.
- Highlight if the PR makes breaking changes to the specification (in beta there can still be
select breaking changes, but after 1.0 this will change)

All pull requests should submit clean markdown, which is checked by the continuous integration
system. Please use `npm run check-markdown` locally, as described in the [next section](#using-check-markdown-locally), 
to ensure that the checks on the pull request succeed. If it does not then you can look at the
mistakes online, which are the same as running `check-markdown` locally would surface.

All pull requests that modify or create JSON examples should use [JSON 
formatter](https://jsonformatter.org/) to keep files consistent across the repo. 

All pull requests additionally require a review of two STAC core team members. Releases are cut
from dev to master (and require 3 approvals).

### Using check-markdown locally

The same check-markdown program that runs as a check on PR's is part of the repo and can be run locally. 
To install you'll need npm, which is a standard part of any [node.js installation](https://nodejs.org/en/download/). 
Alternatively, you can also use [yarn](https://yarnpkg.com/) instead of npm. In this case replace all occurrences of 
`npm` with `yarn` below.

First you'll need to install everything with npm once. Just navigate to the root of the stac-spec repo and on 
your command line run:

```bash
npm install
```
Then to do the check on your markdown you run:

```bash
npm run check-markdown
```

This will spit out the same text that you see online, and you can then go and fix your markdown.

### Working with the OpenAPI files

The definitive specification for STAC API is provided as an [OpenAPI](http://openapis.org/) 3.0 specification that is
contained within several YAML files in the various directories. These live in the same place as the markdown defining
various parts of the specification. Currently we expect developers to be up to speed with
OpenAPI and using their own tools to modify things. In the future we will provide tools to make it easier to work with.
There are html version of the OpenAPI files online at `https://api.stacspec.org/{version_number}` with `{version_number}` being the git tag or `dev`.

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
- **Merge dev to master**: As there is no 'build' process, since the specification *is* the markdown files in the github
repository, the key step in a release is to merge the `dev` branch into `master`, as `master` is the current stable state 
of the spec.
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
additional RC is needed. After there is no more changes to spec or schemas then the release process should be done on master,
with no changes to the spec - just updating the version numbers.

## Governance 

The goal of STAC is to have a Project Steering Committee of core contributors, representing diverse organizations and 
implementations. To bootstrap Chris Holmes is the Benevolent Dictator for 
Life or until a PSC is formed, so we don't get stuck waiting for votes when there is not enough activity. 

The longer term goal is to contribute STAC spec to the Open Geospatial Consortium, and indeed to align as much as possible
with their next generation spec. The current plan is to contribute STAC API as an OGC 'community module' when we reach
1.0.0, and to work to have it become part of the OGC API baseline.
