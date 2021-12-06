#VHeader

The sticky header at the top of the page. On the homepage and the content pages, it shows the
Openverse logo and page links ??and Search bar??, and on the Search page it additionally has
a Content Switcher, "burger menu" for page links, and a filters button.
On mobile, the header only shows the logo and close button when the overlay (pages, content
switcher, or filters) is open.

## Components
### VLogoLoader
### VFilterButton
The button that opens the Filters sidebar (or Modal on mobile). When any filters are selected,
the button displays the number of filters selected.
Filter button is not shown on mobile when the sidebar/menu is open.
Filter button states:

|  | Desktop Initial | Desktop Scrolled | Mobile Initial | Mobile Scrolled |
|---|---|---|---|---|
| 0 Filters | Icon Filters, no border | Icon Filters, border | Icon | Icon, no border (?) |
| 5 Filters | 5 Filters, gray | 5 Filters, gray | 5 Filters, gray | 5, gray |

Filter button style:

|  | Desktop Initial | Desktop Scrolled | Mobile Initial | Mobile Scrolled |
|---|-----------------|------------------|----------------|-----------------|
| 0 Filters | No border       | Border           | No border      | No border(?)    |
| 5 Filters | Gray            | Gray             | Gray              | Gray               |

Filter button label:

|  | Desktop Initial | Desktop Scrolled | Mobile Initial | Mobile Scrolled |
|---|---|----------------|---|---|
| 0 Filters | Icon Filters | Icon Filters   | Icon | Icon |
| 5 Filters | 5 Filters | 5 Filters  | 5 Filters | 5 |


Styling notes:
1. `align-self` for the button prevents its height from
   growing to the parent's height.
2. Width and height set for the SVG prevent the flash of un-styled SVG,
   where the svg is displayed incorrectly before the CSS has been loaded.
