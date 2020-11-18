## STAC Development & Release Process

### Development Process

The SpatioTemporal Asset Catalog API specification is under active development. 

The `master` branch aims to always be stable, meaning that all the pieces of the specification are consistent and well
explained, and all the examples are consistent with the specification. The `dev` branch is a place of active development, 
where a new change in one part of the spec might not yet be fully updated everywhere else. The team uses the 
[stac-api-spec issue tracker](https://github.com/radiantearth/stac-api-spec/issues) to identify and track all that will be done for 
a release. Once all the major issues are resolved the core team makes sure everything is consistent across the spec and
examples.

Any changes to the spec must be made as pull requests to the `dev` branch. Anyone is welcome and encouraged to bring ideas
and improvements, to the issue tracker or (ideally) as pull requests. To merge a new pull request the work must be reviewed
by at least two members of the STAC spec core team (who have write access to the main repository). It also must pass the
Continuous Integration testing.

### Release Process

To release a new version of the STAC spec the following list of tasks must be done. 

* **Update Issue Tracker**: Each release has a [milestone](https://github.com/radiantearth/stac-spec/milestones) in the github 
issue tracker, and before a release is done all open issues that are filed against it should be reviewed. All issues do not 
need to be completed, but the core release team should all review the issues to make sure that the critical ones for the 
release have been addressed. Issues that aren't seen as essential should be moved to future releases, so that there are no
open issues against the milestone.
* **Check dependencies**: STAC relies on OGC API - Features and STAC Core specifications at its core, and will likely rely
on additional Features API extensions as well as OGC API - Commons. We aim to always reference the latest version of these,
so before releasing we should check to make sure we are on the latest stable versions, and upgrade if it makes sense. We include
the latest stable STAC core spec version as a 'submodule', so before release we should update that to be the latest.
* **Agreement from core team**: The core STAC API team should meet (on video or on gitter) and decided that the release is ready.
This should include review of the issues, as well as looking at the spec holistically, to make sure the new changes keep
with a coherent whole.
* **Final Spec Read Through**: There should be a final read through of the core specification to make sure it makes sense
and there are no typos, errors, etc.
* **Update the Changelog**: The [changelog](CHANGELOG.md) should be reviewed to make sure it includes all major improvements
in the release. And anything in 'unreleased' section should move to the version of the spec to be released.
* **Merge dev to master**: As there is no 'build' process, since the specification *is* the markdown files in the github
repository, the key step in a release is to merge the `dev` branch into `master`, as `master` is the current stable state 
of the spec.
* **Check Online API Docs**: Check to make sure the online API docs reflect the release at <https://stacspec.org/STAC-api.html> 
and <https://stacspec.org/STAC-ext-api.html> (this step may go away once we are confident this works well, as this publishing is in flux)
* **Release on Github**: The final step to create the release is to add a new 'release' on 
<https://github.com/radiantearth/stac-spec/releases>. This should use a tag like the others, with a 'v' prefix and then the 
release number, like v0.5.2. The changelog should be copied over to be the release notes, and then also include a link to 
the full milestone of everything closed in the issue tracker.
* **Promote the release**: A blog post and tweet should be composed and sent out, and then inform those in the gitter channel
to post / promote it.

#### Release Candidates

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

### Governance 

The goal of STAC is to have a Project Steering Committee of core contributors, representing diverse organizations and 
implementations. To bootstrap Chris Holmes is the Benevolent Dictator for 
Life or until a PSC is formed, so we don't get stuck waiting for votes when there is not enough activity. 

The longer term goal is to contribute STAC spec to the Open Geospatial Consortium, and indeed to align as much as possible
with their next generation spec. The current plan is to contribute STAC API as an OGC 'community module' when we reach
1.0.0, and to work to have it become part of the OGC API baseline.