# Deployment Guide for Sybell Hosting

This guide will walk you through deploying your Parisian Tour Guide landing page to Sybell hosting (cPanel/Apache).

## Prerequisites

- Access to your Sybell hosting cPanel
- FTP client (FileZilla, Cyberduck, etc.) or cPanel File Manager
- Your domain properly configured

## Step 1: Build the Project

1. Ensure all your content is ready:
   - Images are in `public/images/`
   - `.env.local` is configured (for Sanity CMS)
   - All content is finalized

2. Run the build command:
   ```bash
   npm run build
   ```

3. This creates an `out/` folder with all static files ready for deployment.

## Step 2: Upload to Sybell Hosting

### Option A: Using cPanel File Manager

1. Log in to your cPanel
2. Navigate to **File Manager**
3. Go to `public_html/` (or your domain's root directory)
4. **Delete** all default files (index.html, etc.)
5. Upload all contents from the `out/` folder to `public_html/`
   - Make sure to upload the contents, not the folder itself
   - Your directory should look like:
     ```
     public_html/
     ├── _next/
     ├── images/
     ├── index.html
     ├── about/
     ├── tours/
     └── contact/
     ```

### Option B: Using FTP Client

1. Open your FTP client (e.g., FileZilla)
2. Connect to your Sybell hosting:
   - Host: `ftp.yourdomain.com` or your server IP
   - Username: Your cPanel username
   - Password: Your cPanel password
   - Port: 21

3. Navigate to `public_html/` on the remote server
4. Upload all contents from the `out/` folder

## Step 3: Configure .htaccess (Recommended)

Create or edit `.htaccess` in your `public_html/` directory:

```apache
# Enable rewrite engine
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Force HTTPS (recommended)
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # Handle trailing slashes
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.+)/$ /$1 [R=301,L]

  # Serve HTML files without .html extension
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME}.html -f
  RewriteRule ^(.*)$ $1.html [L]
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

## Step 4: Verify Deployment

1. Visit your domain: `https://yourdomain.com`
2. Check all sections load properly:
   - Hero section with animations
   - About section
   - Tours section
   - Contact section
   - WhatsApp FAB button

3. Test on mobile devices
4. Verify all links work
5. Check browser console for any errors

## Step 5: DNS Configuration (If Needed)

If your domain isn't pointing to Sybell hosting:

1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Update nameservers to Sybell's nameservers (provided by Sybell)
3. Or update A record to point to your server IP
4. Wait 24-48 hours for DNS propagation

## Updating the Site

To update your site after making changes:

1. Make your changes locally
2. Test locally: `npm run dev`
3. Build: `npm run build`
4. Upload the new `out/` folder contents to `public_html/`
5. Clear browser cache and test

## Troubleshooting

### Issue: Images not loading
- Verify images are in `public_html/images/`
- Check file permissions (644 for files, 755 for directories)
- Ensure image paths are correct in your code

### Issue: 404 errors on page refresh
- Verify `.htaccess` is configured correctly
- Check that mod_rewrite is enabled in cPanel

### Issue: Styles not loading
- Clear browser cache
- Verify `_next/` folder was uploaded
- Check file permissions

### Issue: Site loads slowly
- Enable compression in `.htaccess`
- Optimize images before uploading
- Enable browser caching

## Performance Optimization

1. **Image Optimization:**
   - Use tools like TinyPNG or Squoosh
   - Aim for images under 500KB
   - Consider WebP format

2. **Caching:**
   - Configure browser caching in `.htaccess`
   - Use Cloudflare (free tier) for CDN

3. **Compression:**
   - Enable Gzip compression in `.htaccess`

## SSL Certificate

1. In cPanel, go to **SSL/TLS Status**
2. Enable AutoSSL for your domain
3. Or install Let's Encrypt certificate
4. Force HTTPS in `.htaccess` (see Step 3)

## Support

For Sybell-specific issues:
- Contact Sybell hosting support
- Check their documentation

For site-specific issues:
- Review build logs
- Check browser console
- Verify file permissions

## Checklist

- [ ] Site built successfully (`npm run build`)
- [ ] All files uploaded to `public_html/`
- [ ] `.htaccess` configured
- [ ] Images uploaded and loading
- [ ] SSL certificate installed
- [ ] DNS configured correctly
- [ ] All sections tested
- [ ] Mobile responsive verified
- [ ] Contact form tested
- [ ] WhatsApp button working

---

**Congratulations!** Your Parisian Tour Guide landing page is now live! 🎉
