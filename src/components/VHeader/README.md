#VHeader

The sticky header at the top of the page. On the homepage and the content pages, it shows one version, and on the Search page it additionally has a Content Switcher, collapsed menu for page links, and a filters button. On mobile, the header only shows the logo and close button when the overlay/flyout menu (containing pages, the content switcher, and filters) is open.

## Components

### VLogoLoader

- TBD

### VFilterButton

This button toggles the filter drawer on desktop and opens the mobile menu set to the filters pane on mobile.

- When the header is scrolled, remove the button's border
- When there's applied filters, replace the filter icon with the # of active filters
- On scroll, hide the word label (the word 'Filters') to save space
