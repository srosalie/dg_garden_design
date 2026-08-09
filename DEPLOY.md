


# Option 1 #

# CloudFlare Pages #

Simple & straightforward deployment- connect to GitHub to make changes, site automatically deploys.

Solid free tier.

Options to add future services.

# GitHub Pages #

Very simple, free, & reliable. However, lacks as many features as CloudFlare Pages or other options.



# Option 2 #


# Deployment Guide — Contabo VPS with Nginx

This guide covers deploying the Dirt Girls Garden Design static website to a
Contabo VPS running Ubuntu/Debian, using Nginx as the web server and Let's
Encrypt for SSL.

## Prerequisites

- A Contabo VPS running Ubuntu 20.04+ or Debian 11+
- SSH access to the VPS (root or a sudo user)
- The domain `dirtgirlsgardendesign.com` registered and DNS-managed

## Quick Start (1-7 Steps)

1. **SSH into the Contabo VPS** (Ubuntu/Debian):
   ```bash
   ssh root@YOUR_VPS_IP
   ```

2. **Install Nginx:**
   ```bash
   sudo apt update && sudo apt install nginx
   ```

3. **Copy the `dg_website_vanilla/` contents to `/var/www/dirtgirls/`:**
   ```bash
   sudo mkdir -p /var/www/dirtgirls
   sudo cp -r dg_website_vanilla/* /var/www/dirtgirls/
   sudo chown -R www-data:www-data /var/www/dirtgirls
   ```

4. **Create an Nginx server block config** (domain, root, index, gzip):
   ```bash
   sudo nano /etc/nginx/sites-available/dirtgirls
   ```
   Paste the config from the [Nginx Config](#nginx-config) section below.

5. **Enable the site, restart Nginx:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/dirtgirls /etc/nginx/sites-enabled/
   sudo nginx -t          # Test config syntax
   sudo systemctl restart nginx
   ```

6. **Set up SSL with Certbot/Let's Encrypt:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d dirtgirlsgardendesign.com -d www.dirtgirlsgardendesign.com
   ```

7. **Point DNS A records to the VPS IP:**
   - `dirtgirlsgardendesign.com` → A record → `YOUR_VPS_IP`
   - `www.dirtgirlsgardendesign.com` → A record → `YOUR_VPS_IP`

---

## Nginx Config

Save this as `/etc/nginx/sites-available/dirtgirls`:

```nginx
# Dirt Girls Garden Design — Nginx server block
server {
    listen 80;
    listen [::]:80;
    server_name dirtgirlsgardendesign.com www.dirtgirlsgardendesign.com;

    root /var/www/dirtgirls;
    index index.html;

    # Gzip compression for text-based assets
    gzip on;
    gzip_types text/plain text/css application/json application/javascript
               text/xml application/xml image/svg+xml;
    gzip_min_length 256;
    gzip_vary on;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Long cache for static assets (images, fonts)
    location ~* \.(jpg|jpeg|png|gif|ico|svg|woff2|css|js)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # HTML files — shorter cache so updates propagate quickly
    location ~* \.html$ {
        expires 1h;
        add_header Cache-Control "public, must-revalidate";
    }

    # Default location
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Custom 404 page (optional — falls back to Nginx default if not present)
    error_page 404 /404.html;
}
```

Certbot will automatically modify this config to add the SSL (443) server block
and redirect HTTP to HTTPS when you run it in step 6.

---

## SSL / Let's Encrypt Setup

After running the Certbot command in step 6:

- Certbot automatically obtains and installs the SSL certificate.
- It modifies the Nginx config to listen on port 443 with SSL.
- It adds a 301 redirect from HTTP (port 80) to HTTPS.

**Renewal:** Certbot installs a systemd timer that auto-renews certificates
before they expire (90-day validity). Verify it works:

```bash
sudo certbot renew --dry-run
```

---

## DNS Configuration

At your domain registrar (or DNS provider), create these records:

| Type  | Host | Value          | TTL  |
|-------|------|----------------|------|
| A     | @    | YOUR_VPS_IP    | 3600 |
| A     | www  | YOUR_VPS_IP    | 3600 |

- Replace `YOUR_VPS_IP` with your Contabo VPS IPv4 address.
- DNS propagation typically takes 15 minutes to a few hours.
- Verify with `dig dirtgirlsgardendesign.com` or `nslookup`.

---

## File Transfer (Local → VPS)

From your local machine, transfer the site files using `scp` or `rsync`:

**Using scp:**
```bash
scp -r dg_website_vanilla/* root@YOUR_VPS_IP:/var/www/dirtgirls/
```

**Using rsync** (preferred — only transfers changed files on redeploys):
```bash
rsync -avz --delete dg_website_vanilla/ root@YOUR_VPS_IP:/var/www/dirtgirls/
```

After transferring, fix ownership:
```bash
ssh root@YOUR_VPS_IP "sudo chown -R www-data:www-data /var/www/dirtgirls"
```

---

## Security Notes

- **Nginx is secure for serving static content.** It has a small attack surface
  compared to application servers (Node, PHP, etc.) because it does not execute
  server-side code.
- **Keep the system patched:** Run `sudo apt update && sudo apt upgrade`
  regularly (or set up unattended security updates).
- **Firewall:** Enable `ufw` to restrict ports:
  ```bash
  sudo ufw allow OpenSSH
  sudo ufw allow 'Nginx Full'
  sudo ufw enable
  ```
- **SSH:** Disable root password login and use SSH keys for authentication.
  Edit `/etc/ssh/sshd_config`:
  ```
  PermitRootLogin prohibit-password
  PasswordAuthentication no
  ```
  Then `sudo systemctl restart sshd`.
- **No known vulnerabilities** specific to serving static files via Nginx.
  The main risk is an unpatched OS or Nginx version — stay up to date.

---

## Updating the Site

To push updates after making changes locally:

```bash
rsync -avz --delete dg_website_vanilla/ root@YOUR_VPS_IP:/var/www/dirtgirls/
```

Nginx serves files directly from disk, so no restart is needed for content
updates. Only restart Nginx if you change the server block config:

```bash
sudo nginx -t && sudo systemctl reload nginx
```
