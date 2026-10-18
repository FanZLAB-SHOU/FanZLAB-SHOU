# Profile graphics

Run `node design/build-assets.cjs .` from the repository root to rebuild the SVG cover, research panels, methods panel, project links and navigation buttons. The script uses Node's standard library only.

The graphics use the laboratory website's ocean-blue palette and contain no external fonts, scripts or embedded resources. `README.md` switches the research and methods panels to their mobile versions below a 640 px viewport. Native text and research links remain available in the expandable research section.

The five research directions follow the OFEL website. The R/TMB/C++ panel follows the ALSCL package documentation. The globe, paths and line icons are decorative diagrams; they do not represent measured data. The GitHub dashboard uses actual public API data, stored with a timestamp in `data/github-metrics.json`. Forks are included in language byte counts and identified in the panel. The account contribution graphs do not merge activity from other accounts or the separate laboratory organisation. Existing PNG and button assets from the first profile version are retained for reuse.


Tool glyphs are the Devicon R, Python, C++, Git and GitHub logos. Sources and the MIT license are retained in `assets/logos/`. Python replaces the former ggplot2 tile at the user's request. TMB remains identified as the modelling engine.

Run `node scripts/github-dashboard.cjs` to refresh public GitHub metrics using an authenticated `gh` CLI, or `node scripts/github-dashboard.cjs --snapshot` to rebuild charts from the saved snapshot without a network request. The GitHub workflow refreshes the statistics daily and after dashboard-source changes; its token is supplied by GitHub and never written to the data snapshot.
