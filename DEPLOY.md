# Deploying Aksarium to GitHub Pages

A morning checklist. The site is plain HTML, CSS and JavaScript with no build step, so GitHub Pages serves it as-is. Everything below is done through the GitHub Desktop app and your domain registrar; nothing needs the command line.

## What is already in the repo for you

- `CNAME` — holds your custom domain. It currently says `aksarium.com`. If the domain you bought is different, open this file and change that one line before you push.
- `.nojekyll` — tells GitHub Pages to serve the files directly rather than running them through Jekyll. Leave it as is.
- `404.html` — a themed "page not found" screen, served automatically for bad links.

## Step 1: Publish the repo (GitHub Desktop)

1. In GitHub Desktop: File, then Add Local Repository, and choose this `aksarium-site` folder. When it offers to create a repository here, accept.
2. It will show every file as a change. Write a first commit summary (for example, "Initial site") and click Commit to main.
3. Click Publish repository. Give it a name (for example, `aksarium-site`). Whether you tick "Keep this code private" matters; see the note below.

## Step 2: Turn on Pages

1. On github.com, open the new repository, then Settings, then Pages (in the left sidebar).
2. Under "Build and deployment", set Source to "Deploy from a branch", branch `main`, folder `/ (root)`. Save.
3. Give it a minute; the same page will show a live URL like `https://<your-username>.github.io/aksarium-site/`. Check the site works there first, before the domain is attached.

## Step 3: Attach the custom domain

1. Still in Settings, then Pages, under "Custom domain", type your domain (for example `aksarium.com`) and Save. GitHub will keep the `CNAME` file in step with this.
2. At your domain registrar, add these DNS records (verified against GitHub's documentation on 2 August 2026):

   Apex domain (`aksarium.com`), four A records, all pointing the bare domain at these IPv4 addresses:

   - 185.199.108.153
   - 185.199.109.153
   - 185.199.110.153
   - 185.199.111.153

   And, if your registrar supports IPv6, four AAAA records:

   - 2606:50c0:8000::153
   - 2606:50c0:8001::153
   - 2606:50c0:8002::153
   - 2606:50c0:8003::153

   The `www` subdomain, one CNAME record: point `www` at `<your-username>.github.io` (your username, no repository name, with the trailing dot if the registrar wants one).

3. Back in Settings, then Pages, once DNS has propagated, tick "Enforce HTTPS". GitHub issues the certificate for you; the tick box may be greyed out for a little while until the domain verifies.

Note: DNS changes can take up to 24 hours to propagate, though it is often much faster. If the domain shows a certificate error for the first hour or two, that is normal; give it time before worrying.

## The one decision worth making consciously: public or private

GitHub Pages runs for free from a public repository. Serving Pages from a private repository needs a paid plan (GitHub Pro or above). Two things follow:

- If you publish the repo as public, the site's source is public too. That includes the essay drafts currently marked "under revision". The finished site is meant to be public anyway, so this is usually fine; just know the drafts are visible to anyone who looks in the repository, not only on the polished pages.
- Your research briefings and the plan document are safe either way: they live in the parent `Aksarium` folder, outside `aksarium-site`, so they are never part of this repository and never published.

If you would rather keep the drafts private until they are finished, the options are to publish privately on a paid plan, or to hold the not-yet-ready pages out of the repo until they are done. Say the word and I can split the repo that way.

## After it is live

When you add the remaining hero images or finish an essay, it is the same loop each time: drop the files in, commit in GitHub Desktop, push. Pages redeploys within a minute or two. No rebuild, no extra steps.
