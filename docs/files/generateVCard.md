# `src/services/generateVCard.js`

**Location**: `src/services/generateVCard.js` (69 lines)

## File Purpose

Generates a vCard 3.0 string for a person given their name, designation, contact, and social handles. **Currently dead code** — no file in the project imports it. The actual "Save Contact" button in `UserView` builds a vCard inline.

## Imports

None.

## Exports

### `generateVCard(fullName, designation, contact = {}, socials = {})`
Returns a multi-line `BEGIN:VCARD ... END:VCARD` string.

## Internal Logic

1. Starts the vCard with `FN` (formatted name) and `TITLE` (designation).
2. Adds `TEL;TYPE=cell`, `EMAIL;TYPE=internet`, and an X-ABLabel-style WhatsApp item.
3. Iterates the `socials` object; for each non-empty value, looks up the matching URL prefix (e.g. `linkedin` → `https://linkedin.com/in/`) and writes an `itemN.URL` + `itemN.X-ABLabel` pair starting from `item2` (since `item1` is reserved for WhatsApp).
4. Returns the full string.

## Known social prefixes

`whatsapp`, `instagram`, `linkedin`, `facebook`, `twitter`, `website`, `youtube`, `spotify`, `telegram`, `pinterest`, `threads`, `behance`, `github`, `tiktok`, `c_link1`, `c_link2`.

## Dependencies

None (pure utility).

## Used By

Nothing — dead code.

## Risks

* The whitespace between fields and the lack of CRLF might not parse well in every contacts app (the spec requires CRLF).
* If you decide to use this, prefer replacing the inline vCard in `UserView` (which only includes name/phone/email) with this richer generator. Today the inline code is the one that ships.
