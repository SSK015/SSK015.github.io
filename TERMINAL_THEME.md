# Terminal theme

The home page, publications, CV, and paper detail pages use the shared
`terminal` layout. The original AcademicPages template remains available
for the other archive pages.

## Edit content

- `_data/terminal.yml`: homepage introduction, working principles, hobbies,
  and public profile links.
- `_data/work.yml`: project purpose, personal contribution, collaboration context,
  and verified public code/setup/evaluation links. The current contributions are
  based on the September 2026 personal CV, not inferred from author order.
- `_publications/*.md`: paper titles, authors, venues, and links. Add
  `venue_short` and `display_year` for the compact venue column.
- `_pages/cv.md`: the web CV.
- `_includes/terminal-home.html`: homepage structure.
- `_includes/terminal-work.html`: project cards; papers are supporting references,
  rather than the homepage's primary content.
- `assets/css/terminal.css`: colors, spacing, responsive layouts, and print.
- `assets/js/terminal.js`: the profile terminal and command menu.
- `_data/fortunes.yml`: editable original short quotes for the `fortune` command.

Set `publication_status: Accepted` for accepted papers in the research archive.
The archive remains chronological; the homepage uses the order in `_data/work.yml`.
No author-rank badges appear on the homepage. Research project names have a
smaller italic `@Conference Year` suffix, drawn from the linked publication's
`venue_short` and `display_year`. Projects without a linked publication omit it.

For a future independent project, use `context: Independent exploration` and
provide `details_url` and/or `source_url`; `paper_path` is optional. Do not label
collaborative research as independent work or create placeholder projects.

The independent `/publications/` page is the full publication list. Its opening
summary counts `authorship_role: first-author` and `authorship_role: collaborator`
by `venue_short`. Set the role explicitly; do not infer it from the Work cards.
Publications not listed in `_data/work.yml` appear in the full list and web CV,
but not in the homepage's `ls work/` listing or Work cards. Keep authorship counts
on the independent publication page, not the personal homepage.

Only add public repository links after checking their visibility. Source and
instructions being public is not a claim that every result has been reproduced.
Do not copy private contact details, lab addresses, or access instructions from
CVs or evaluation material onto the homepage.

## Public PDFs and artifact badges

`pdf_local` in a publication record enables the site's direct PDF link. Keep the
public download URL (`pdf_source_url`), source name, page count, download check
date, and SHA-256 alongside it. Preserve the publisher link and the unchanged
public PDF, including its attribution/license notices. Mirror provenance is
documented in `files/papers/README.md`.

`artifact_badges` is an explicit list of awarded badges. Prefer an
`artifact_badges_source` pointing to the public official award record. Before that
record is public, an explicit author confirmation can be recorded with
`artifact_badges_confirmed_by: author` and `artifact_badges_confirmed_on`. Do not
publish private evaluation links or notification emails. An optional
`artifact_badges_info_url` links to clearly labeled badge definitions, not to an
award record. A public repo, generic badge guide, or artifact appendix alone does
not establish an award. The reusable strip appears in project cards, the full
publication list, the web CV, and paper details; it does not create Work entries.
The strip uses the unmodified official ACM v1.1 images in `assets/images/badges/`,
mapped by `_data/artifact_badges.yml`, with accessible names. Only link the award
heading to official results when a public award record exists; author-confirmed
awards use a plain heading and an optional separate definitions link. Do not
recolor badges or show them for unverified awards.

## Homepage artwork

`cover_image` in `_data/work.yml` adds a large illustration above a project card.
`personal_art` in `_data/terminal.yml` supplies the interest-section illustration.
These are decorative artwork, not system architecture diagrams, screenshots of
an implementation, or claims about measured results. Keep the verified project
text unchanged. Use local, optimized assets with reserved dimensions and lazy
loading. Artwork prompts and provenance are recorded in `assets/images/README.md`.

## Local preview

```sh
bundle install
bundle exec jekyll serve --safe --host 127.0.0.1 --port 4173
```

Open http://127.0.0.1:4173/. GitHub Pages still builds the existing
`master` branch; changing the theme does not require a new deployment service.

## Interactions

- `Ctrl+K` / `Cmd+K`: open the searchable command menu.
- Arrow keys / Enter: choose a menu action; Escape closes the native dialog.
- Homepage terminal: `help`, `whoami`, `ls`, `cat approach.txt`, `cat interests.txt`,
  `about`, `approach`, `work`, `personal`, `papers`, `cv`, `contact`, `github`,
  `scholar`, `theme`, `fortune`, and `clear`.
- `fortune`: draw a local fortune-cookie quote. It avoids consecutive repeats,
  handles an empty or single-quote pool, and makes no network requests. The same
  action is available in the homepage's command menu. Edit `_data/fortunes.yml`
  to add/remove quotes; duplicate and blank entries are ignored by the client.
- `research` and `publications` remain aliases for the research archive;
  the old `#research` and `#publications` home anchors are retained.
- The terminal is a profile navigator, not a shell or remote login.
- The theme switch remembers a light/dark preference on the current browser.
- The CV's Print / save PDF action uses the browser's print dialog.
- Navigation and academic content remain available without JavaScript.
