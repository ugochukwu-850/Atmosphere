# Design spec (from Figma "Artmostsphere 2")

Source: https://www.figma.com/design/l66gPmsO2UZ7swMlXZ8y9W/Artmostsphere-2 (page **Work**).
Frames are 1512px wide. Values below were read from the file's named styles;
where the file has no style (radii, spacing) they were measured from the frames.

## Fonts

| Role | Family | Figma style |
| --- | --- | --- |
| Headings | **Sora** | `Heading/H*/…` |
| Body, labels, buttons | **Manrope** | `Family/secondary`, `Body/Body-*` |

Badge label: Manrope 800, 10px, uppercase, line-height 100%.

## Colours (named in Figma)

| Token | Hex | Used for |
| --- | --- | --- |
| Product Rust / Production Action (primary) | `#B94E2D` | primary buttons, active tab, eyebrows, bullets |
| Secondary Action | `#53634A` | "Request a booking", Scout-only badge, map toggle, footer "Gear" tag |
| Deep Charcoal 500 | `#171715` | text, dark hero band |
| Deep Charcoal 600 | `#51514A` | secondary text |
| Deep Charcoal 700 | `#8B8B7E` | muted text |
| Main Background / Warm Ivory | `#F4F0E7` | beige sections, callouts, input fill |
| Cards + Panels | `#FCFBF7` | cards, price panel |
| Warm Ivory 1000 | `#FFFFFF` | page background |
| Warm Ivory 100 / 200 | `#31302D` / `#62605A` | text on dark surfaces |
| Warm Sand | `#D8C6A5` | highlight words, step numbers, footer "Talent & Cast" tag |
| Warm Sand 800 / 900 | `#F5E3C2` / `#FFEDCC` | soft sand fills |
| Black | `#000000` | "How it works" band, footer |

## Frames

### Landing Page
1. **Hero**: photo card inset 8px with 24px radius, dark overlay. Nav inside the card:
   wordmark "Artmostsphere"; links What We Offer · How it works · About Us · Planner;
   "Become a provider" (dark translucent, 1px border) + "Sign In" (rust).
   Eyebrow "THE PRODUCTION ECOSYSTEM FOR AFRICA" (tracked caps). H1 "Find what your
   next **shoot needs.**" (sand). Sub "Locations. Gear. Cast. Planning. All in one
   production space. Move from a first idea to the people and resources that bring it
   to life." CTA "Explore Artmostsphere". White search card overlapping the bottom:
   tabs Location · Cast & Talent · Rent Gear · Buy Gear; fields What are you planning? ·
   Where? · When? · Search.
2. **What are you looking for?**: three photos fanned (rotated ±6°, white border, shadow);
   caption "A place, the right kit, the right people—or a plan to bring it all together."
3. **Everything your production needs, in one place.** (ivory band): right-aligned intro;
   three tall image cards "— 01 / LOCATION", "— 02 / Gear", "— 03 / Cast & Talent" with
   "Explore →".
4. **From idea to production, without the chaos.** (black): "01-04" watermark, 4 steps
   with sand numbers and column dividers, sand tagline.
5. **Planner**: eyebrow PLANNER, "Have the idea. We'll make it happen.", "Plan a shoot";
   plan card "Fashion Hall event" with tabs and Production Requirements grid.
6. **Have a resource filmmakers need?**: full-bleed photo, chips Location · Gear · Talent ·
   Creative Service, "Become A Provider".
7. **About us**: photo left (tag "BUILT FOR THE PEOPLE WHO MAKE THINGS"), ivory right:
   "Production is bigger than the camera.", copy, OUR VISION callout.
8. **FAQ**: "Frequently asked questions." + accordion.
9. **CTA**: image-filled "YOUR NEXT PRODUCTION STARTS HERE." + "Explore".
10. **Footer** (black, 64px top radius): brand, 4 link columns with dividers, copyright,
    "Starting in Nigeria. Building for Africa", giant ivory "ArtMostSphere" with tilted
    tags Location (rust) · Gear (olive) · Talent & Cast (sand).

### Location Search / with map
Dark band (charcoal) holding the header (rust wordmark; Location · Gear · Talent and
Cast · Planner; compact search pill + avatar), breadcrumb, "Find a **place** that fits
the frame.", intro, right note "From Lagos streets to studio interiors". White body:
"Places to make the scene", count line, "Show Map" toggle, underline tabs All Places ·
Bookable Space · Scout-only Places, optional full-width map, 3-column cards, square
pagination. Card: panel fill, 1px border, 16px radius; image 12px radius with badge
(BOOKABLE white / SCOUT-ONLY olive) and bookmark button; rust category caps; title;
2-line description; price "₦180,000 / day"; buttons View details (rust) +
Request a booking / Contact Venue (olive).

### Location Detail / Detail 2
Light header with bottom border. Breadcrumb, H1, dot meta (Bookable · Yaba Lagos ·
Production Listing), gallery (large left + two stacked right, "VIEW ALL PHOTOS").
"About this space": listed-by row, dot meta between rules, description, Production
details (rust bullets, 2 columns), Access and production notes (ivory callout, rust left
border), Booking information, "Back to all places". Right: panel with white price box,
"● Bookable listing", note, "Request to book". Detail 2: modal "YOUR NEXT STEP / Sign in
to request this booking." + "Sign in or create an account".

Pages without a frame (gear, cast, planner, bookings, account, auth) reuse these
templates and tokens.
