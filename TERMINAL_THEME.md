# Terminal theme

The home page, publications, CV, and paper detail pages use the shared
`terminal` layout. The original AcademicPages template remains available
for the other archive pages.

## Edit content

- `_data/terminal.yml`: homepage introduction, research areas, hobbies,
  and public profile links.
- `_publications/*.md`: paper titles, authors, venues, and links. Add
  `venue_short` and `display_year` for the compact venue column.
- `_pages/cv.md`: the web CV.
- `_includes/terminal-home.html`: homepage structure.
- `assets/css/terminal.css`: colors, spacing, responsive layouts, and print.
- `assets/js/terminal.js`: the profile terminal and command menu.

Set `publication_status: Accepted` for accepted papers. Set
`featured: true` for a first-author paper to show it first on the homepage.
The publication list itself remains chronological.

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
- Homepage terminal: `help`, `whoami`, `ls`, `cat interests.txt`,
  `about`, `research`, `papers`, `cv`, `contact`, `github`,
  `scholar`, `theme`, and `clear`.
- The terminal is a profile navigator, not a shell or remote login.
- The theme switch remembers a light/dark preference on the current browser.
- The CV's Print / save PDF action uses the browser's print dialog.
- Navigation and academic content remain available without JavaScript.
