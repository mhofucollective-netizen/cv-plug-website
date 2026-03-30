# CV Plug — Website

Premium career services website. Pure static — no build step, no dependencies.

---

## Why assets fail on Cloudflare Pages (the common mistake)

All asset paths in `index.html` are **root-relative**:

```
assets/css/style.css
assets/js/script.js
assets/videos/hero.mp4
assets/videos/exploding-view.mp4
assets/images/logo.jpg
```

These only resolve correctly when **`index.html` is at the root of the repository**.

If you pushed a folder _containing_ `cv-plug/` (e.g. your whole Desktop or Documents), Cloudflare Pages cannot find `index.html` and all paths break. The fix is below.

---

## Project structure

```
(repo root)
├── index.html
├── _headers
├── robots.txt
├── sitemap.xml
├── .gitignore
├── netlify.toml
└── assets/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── script.js
    ├── videos/
    │   ├── hero.mp4
    │   └── exploding-view.mp4
    └── images/
        └── logo.jpg
```

---

## Deploy to GitHub → Cloudflare Pages

### Step 1 — Create a GitHub repository

1. Go to [github.com/new](https://github.com/new)
2. Name it `cv-plug` (or anything you like)
3. Set it to **Private** or Public — your choice
4. **Do NOT** initialise with a README (leave all checkboxes unticked)
5. Click **Create repository**
6. Copy the repo URL shown (e.g. `https://github.com/yourusername/cv-plug.git`)

### Step 2 — Push the project from the correct folder

Open **Git Bash** (or any terminal) and run these commands **exactly**:

```bash
# 1. Navigate INTO the cv-plug folder (not the parent)
cd "C:/Users/pured/cv-plug"

# 2. Confirm index.html is here before continuing
ls index.html

# 3. Initialise git
git init

# 4. Stage everything
git add .

# 5. Commit
git commit -m "Initial deploy"

# 6. Add your GitHub repo as the remote
#    Replace the URL with the one you copied in Step 1
git remote add origin https://github.com/yourusername/cv-plug.git

# 7. Push
git branch -M main
git push -u origin main
```

> **Critical:** `cd` must point to the folder where `index.html` lives directly —
> not to `C:/Users/pured` or any parent folder.

### Step 3 — Connect to Cloudflare Pages

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
2. Authorise Cloudflare to access your GitHub account
3. Select the `cv-plug` repository
4. On the **Set up builds and deployments** screen, set:

   | Setting | Value |
   |---|---|
   | Production branch | `main` |
   | Build command | *(leave empty)* |
   | Build output directory | `/` |
   | Root directory (Advanced) | *(leave empty)* |

5. Click **Save and Deploy**

Cloudflare will deploy in ~30 seconds. Your site will be live at `https://cv-plug.pages.dev` (or your custom domain).

### Step 4 — Verify assets are loading

After deploy, open browser DevTools → Network tab and reload the page. You should see:

- `style.css` → 200
- `script.js` → 200
- `hero.mp4` → 200 or 206 (partial content, normal for video)
- `exploding-view.mp4` → 200 or 206

If any return 404, the most likely cause is Step 2 was run from the wrong directory. Delete the repo, repeat from Step 2.

---

## Push future changes

```bash
cd "C:/Users/pured/cv-plug"
git add .
git commit -m "Your change description"
git push
```

Cloudflare Pages redeploys automatically on every push to `main`.

---

## Local development

Open `index.html` directly in Chrome/Edge, or use a local server:

```bash
# Python (built-in)
cd "C:/Users/pured/cv-plug"
python -m http.server 8080
# then open http://localhost:8080

# Node
npx serve "C:/Users/pured/cv-plug"
```

> Note: The hero video `autoplay` attribute requires a server context in some browsers.
> Opening `index.html` via `file://` may not autoplay — use the local server.

---

## Analytics setup (when ready)

In `index.html`, find the commented blocks in `<head>` and uncomment + fill in your IDs:

**Google Analytics 4**
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Microsoft Clarity**
```html
<script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "YOUR_CLARITY_ID");
</script>
```

---

## Post-deploy checklist

- [ ] Update `<link rel="canonical">` in `index.html` with your real domain
- [ ] Update `sitemap.xml` `<loc>` with your real domain URL
- [ ] Update `robots.txt` sitemap URL with your real domain
- [ ] Add your Google Analytics ID and uncomment the GA script block
- [ ] Add your Microsoft Clarity ID and uncomment the Clarity script block
- [ ] Replace CTA button `href="#"` with your real booking/contact page URL
- [ ] Add a custom domain in Cloudflare Pages → Custom domains
