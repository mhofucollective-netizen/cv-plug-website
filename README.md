# CV Plug — Website

Premium CV writing and career services website. Pure static site — no build step, no dependencies.

## Project Structure

```
cv-plug/
├── index.html                  # Main page
├── assets/
│   ├── css/
│   │   └── style.css           # All styles
│   ├── js/
│   │   └── script.js           # All JavaScript
│   ├── videos/
│   │   ├── hero.mp4            # Hero background video
│   │   └── exploding-view.mp4  # Scroll-scrub animation video
│   └── images/
│       └── logo.jpg            # CV Plug logo
├── robots.txt
├── sitemap.xml
├── _headers                    # Cloudflare Pages cache/security headers
├── netlify.toml                # Netlify config
└── README.md
```

## Local Development

Open `index.html` directly in a browser, or use any static file server:

```bash
# Python
python -m http.server 8080

# Node (npx)
npx serve .

# VS Code — use the Live Server extension
```

## Deployment

### Cloudflare Pages

1. Push this folder to a GitHub repository
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/) → Create a project
3. Connect your GitHub repo
4. Set:
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/` (root)
5. Click Deploy

The `_headers` file is picked up automatically by Cloudflare Pages.

### Netlify

1. Push this folder to a GitHub repository
2. Go to [Netlify](https://app.netlify.com/) → Add new site → Import from Git
3. Connect your GitHub repo
4. Set:
   - **Build command:** *(leave empty)*
   - **Publish directory:** `.` (or leave blank — `netlify.toml` sets this)
5. Click Deploy

The `netlify.toml` handles all configuration automatically.

### Manual drag-and-drop (Netlify)

Zip the entire `cv-plug/` folder and drag it onto the Netlify drop zone at [app.netlify.com](https://app.netlify.com/drop).

## After Deployment — Checklist

- [ ] Update `canonical` URL in `<head>` of `index.html` to your real domain
- [ ] Update `sitemap.xml` with your real domain URL
- [ ] Update `robots.txt` with your real sitemap URL
- [ ] Replace `GA_MEASUREMENT_ID` in `index.html` with your Google Analytics ID and uncomment the script block
- [ ] Replace `CLARITY_PROJECT_ID` in `index.html` with your Microsoft Clarity ID and uncomment the script block
- [ ] Update the CTA button `href="#"` links to point to your booking/contact page

## Analytics Setup

**Google Analytics 4** — uncomment the GA block in `index.html` `<head>`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Microsoft Clarity** — uncomment the Clarity block in `index.html` `<head>`:
```html
<script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "YOUR_CLARITY_ID");
</script>
```
