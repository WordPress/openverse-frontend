#VHeader

The sticky header at the top of the page. On the homepage and the content pages, it shows one version, and on the Search page it additionally has a Content Switcher, collapsed menu for page links, and a filters button. On mobile, the header only shows the logo and close button when the overlay/flyout menu (containing pages, the content switcher, and filters) is open.

## Components

### VLogoLoader

- TBD

### VFilterButton

The button that opens the Filters sidebar (or Modal on mobile). When any filters are selected, the button displays the number of filters selected.

This button is not shown on mobile when the sidebar/menu is open.

#### States

|           | Desktop Initial         | Desktop Scrolled     | Mobile Initial  | Mobile Scrolled     |
| --------- | ----------------------- | -------------------- | --------------- | ------------------- |
| 0 Filters | Icon Filters, no border | Icon Filters, border | Icon            | Icon, no border (?) |
| 5 Filters | 5 Filters, gray         | 5 Filters, gray      | 5 Filters, gray | 5, gray             |

#### Styles

|           | Desktop Initial | Desktop Scrolled | Mobile Initial | Mobile Scrolled |
| --------- | --------------- | ---------------- | -------------- | --------------- |
| 0 Filters | No border       | Border           | No border      | No border(?)    |
| 5 Filters | Gray            | Gray             | Gray           | Gray            |

#### Label

|           | Desktop Initial | Desktop Scrolled | Mobile Initial | Mobile Scrolled |
| --------- | --------------- | ---------------- | -------------- | --------------- |
| 0 Filters | Icon Filters    | Icon Filters     | Icon           | Icon            |
| 5 Filters | 5 Filters       | 5 Filters        | 5 Filters      | 5               |

#### Design notes

1. `align-self` for the button prevents its height from growing to the parent's height.
2. Width and height set for the SVG prevent the flash of un-styled SVG, where the svg is displayed incorrectly before the CSS has been loaded.
