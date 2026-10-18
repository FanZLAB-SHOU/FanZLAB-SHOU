# Profile graphics

Run `node design/build-assets.cjs .` from the repository root to rebuild the SVG cover, research panels, methods panel, project links and navigation buttons. The script uses Node's standard library only.

The graphics use the laboratory website's ocean-blue palette and contain no external fonts, scripts or embedded resources. `README.md` switches the research and methods panels to their mobile versions below a 640 px viewport. Native text and research links remain available in the expandable research section.

The five research directions follow the OFEL website. The R/TMB/C++/ggplot2 panel follows the ALSCL package documentation. The globe, paths and line icons are decorative diagrams; they do not represent measured data. No generated contribution graph or invented GitHub statistics are displayed. Existing PNG and button assets from the first profile version are retained for reuse.
