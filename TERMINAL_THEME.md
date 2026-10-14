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

Set `publication_status: Accepted` for accepted papers in the research archive.
The archive remains chronological; the homepage uses the order in `_data/work.yml`.
No author-rank badges or conference-year display appear on the homepage.

For a future independent project, use `context: Independent exploration` and
provide `details_url` and/or `source_url`; `paper_path` is optional. Do not label
collaborative research as independent work or create placeholder projects.

Only add public repository links after checking their visibility. Source and
instructions being public is not a claim that every result has been reproduced.
Do not copy private contact details, lab addresses, or access instructions from
CVs or evaluation material onto the homepage.

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
  `scholar`, `theme`, and `clear`.
- `research` and `publications` remain aliases for the research archive;
  the old `#research` and `#publications` home anchors are retained.
- The terminal is a profile navigator, not a shell or remote login.
- The theme switch remembers a light/dark preference on the current browser.
- The CV's Print / save PDF action uses the browser's print dialog.
- Navigation and academic content remain available without JavaScript.
