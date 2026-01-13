# Viktória Szeidl - Parisian Tour Guide Landing Page

A luxurious, interactive landing page for a Parisian tour guide, built with cutting-edge web technologies.

## 🎨 Design System

**Parisian Chic Theme:**
- **Fonts:** Playfair Display (headings), Montserrat (body)
- **Colors:**
  - Champagne/Cream: `#F5F5DC`
  - Gold/Bronze: `#D4AF37`
  - Navy Blue: `#002147`
  - Burgundy: `#800020`
- **Effects:** Glassmorphism cards, parallax scrolling, micro-interactions

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **CMS:** Sanity.io
- **Deployment:** Static Export (Sybell/cPanel compatible)

## 📦 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file (copy from `.env.local.example`):
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

4. Add your images to `public/images/` (see `public/images/README.md` for required files)

## 🎭 Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Build for Production

This project is configured for **static export** to deploy on Sybell hosting (cPanel/Apache):

```bash
npm run build
```

This generates an `out/` folder with static files ready for upload.

## 📤 Deployment to Sybell Hosting

1. Build the project:
   ```bash
   npm run build
   ```

2. Upload the contents of the `out/` folder to your cPanel public_html directory

3. Configure your `.htaccess` file for proper routing (optional):
   ```apache
   # Redirect to index.html for cleaner URLs
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule ^(.*)$ index.html [L]
   </IfModule>
   ```

## 🎨 Sanity CMS Setup

### 1. Create a Sanity Project

```bash
npm create sanity@latest -- --project parizs-tours --dataset production
```

### 2. Configure Sanity Studio

The schemas are already defined in `sanity/schemas/`. You can access your Sanity Studio at:

```
https://your-project.sanity.studio/
```

### 3. Content Types

- **Hero Section:** Main landing section content
- **About Section:** Personal info and highlights
- **Tours:** Tour listings with pricing
- **Gallery:** Photo gallery
- **Site Settings:** Contact info, social links, WhatsApp number

## 🎯 Features

### ✨ Interactive Sections

1. **Hero Section**
   - Parallax scrolling effect
   - Smooth fade-in animations
   - Call-to-action button

2. **About Section**
   - Floating image effect on scroll
   - Glassmorphism highlight cards
   - Responsive grid layout

3. **Tours Section**
   - Glassmorphism tour cards
   - Hover lift animations
   - Featured tour badges

4. **Contact Section**
   - Interactive contact form
   - Animated contact info cards
   - WhatsApp integration

5. **WhatsApp FAB**
   - Floating action button
   - Pulse animation
   - Direct WhatsApp messaging

### 📱 Responsive Design

- Mobile-first approach
- Breakpoints: `sm`, `md`, `lg`, `xl`, `2xl`
- Touch-optimized interactions

## 🎨 Customization

### Colors

Edit `tailwind.config.ts` to customize the color palette:

```typescript
colors: {
  champagne: { ... },
  gold: { ... },
  navy: { ... },
  burgundy: { ... },
}
```

### Fonts

Edit `app/layout.tsx` to change fonts:

```typescript
const playfair = Playfair_Display({ ... })
const montserrat = Montserrat({ ... })
```

### Content

Edit section props in `app/page.tsx` or connect to Sanity CMS for dynamic content.

## 📝 File Structure

```
parizs/
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Main landing page
│   └── globals.css         # Global styles & utilities
├── components/
│   ├── Navigation.tsx      # Sticky navigation
│   ├── Footer.tsx          # Footer component
│   ├── WhatsAppFAB.tsx     # WhatsApp floating button
│   └── sections/
│       ├── HeroSection.tsx
│       ├── AboutSection.tsx
│       ├── ToursSection.tsx
│       └── ContactSection.tsx
├── sanity/
│   ├── config.ts           # Sanity configuration
│   └── schemas/            # Content schemas
│       ├── hero.ts
│       ├── about.ts
│       ├── tour.ts
│       ├── gallery.ts
│       └── siteSettings.ts
├── lib/
│   └── sanity.client.ts    # Sanity client & queries
├── public/
│   └── images/             # Static images
├── tailwind.config.ts      # Tailwind configuration
├── next.config.mjs         # Next.js static export config
└── README.md
```

## 🔧 Troubleshooting

### Build Errors

If you encounter build errors related to images:
- Ensure all image paths in components exist in `public/images/`
- Add placeholder images or update the paths

### Sanity Connection Issues

- Verify your `.env.local` has correct `NEXT_PUBLIC_SANITY_PROJECT_ID`
- Check your Sanity project settings and CORS origins

## 📄 License

© 2026 Viktória Szeidl. All rights reserved.

## 💬 Support

For questions or support, contact: viktoria@parizstourist.com
