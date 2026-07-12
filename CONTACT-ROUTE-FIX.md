# Contact Route Fix

This package adds:

`contact/index.html`

That allows Cloudflare Pages to serve:

`https://www.atechspot.com/contact`

as a real directory page without a redirect or rewrite.

The existing direct page remains available:

`https://www.atechspot.com/contact.html`

## Important GitHub step

Upload the entire new `contact` folder to the repository root.

The repository should contain both:

- `contact.html`
- `contact/index.html`

Do not add a `/contact` rule to `_redirects`.

Commit:

`Add native contact route`

Then wait for Cloudflare Pages, purge cache, and test `/contact`.
