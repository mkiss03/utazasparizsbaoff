# 🚀 Multi-Vendor Marketplace Roadmap

**Project:** Transform Parisian Tour Guide into Digital Marketplace for City Guide Flashcard Bundles

**Status:** Phase 1 Complete ✅ | Phase 2 In Progress 🏗️

---

## ✅ Phase 1: Foundation (COMPLETED)

### Database Architecture
- ✅ **User Roles System**: `super_admin`, `vendor`, `customer`
- ✅ **Bundles Table**: Products (flashcard bundles) with pricing, categories, cities
- ✅ **Flashcards Table**: Q&A content linked to bundles
- ✅ **Orders Table**: Purchase tracking with commission calculations
- ✅ **User Purchases Table**: Ownership tracking for access control
- ✅ **RLS Policies**: Multi-vendor security (vendors edit only their content)
- ✅ **Helper Functions**:
  - `user_owns_bundle()` - Check purchase status
  - `get_vendor_stats()` - Vendor performance metrics
  - `get_global_stats()` - Platform analytics (super admin only)

### TypeScript Types
- ✅ `UserRole`, `Bundle`, `Flashcard`, `Order`, `UserPurchase`
- ✅ `VendorStats`, `GlobalStats`
- ✅ Updated `Profile` interface with role fields

### Components
- ✅ **FlipCard Component**: 3D CSS animation for Q&A cards
  - Question/Answer flip effect
  - Locked state for unpurchased content
  - Hint system integration

---

## 🏗️ Phase 2: Admin & Vendor Interfaces (IN PROGRESS)

### Critical TODO Items:

#### 1. Bundle Management Admin Page (`/admin/bundles`)
**Priority: HIGH**
- [ ] Create `/admin/bundles/page.tsx`
- [ ] CRUD interface for bundles
- [ ] Role-based filtering (vendors see only their bundles, super admin sees all)
- [ ] Features needed:
  - Create new bundle form
  - Edit bundle (title, description, price, city, category)
  - Publish/unpublish toggle
  - Delete bundle
  - View statistics (total cards, sales)
  - Bulk actions (optional)

#### 2. Flashcard Editor (`/admin/bundles/[id]/cards`)
**Priority: HIGH**
- [ ] Create flashcard editor page
- [ ] Features needed:
  - Add new flashcard (question, answer, hint, image)
  - Drag-and-drop reordering
  - Inline editing
  - Delete flashcards
  - Preview mode (test the flip animation)
  - Batch import from CSV (optional but useful)

#### 3. Super Admin Dashboard (`/admin/dashboard` - enhanced)
**Priority: HIGH**
- [ ] Update existing dashboard for role-based display
- [ ] Super Admin View:
  - Total revenue (global)
  - Total commission earned
  - Number of vendors
  - Number of bundles
  - Recent orders across all vendors
  - Top-performing vendors
  - Top-selling bundles
- [ ] Use `get_global_stats()` function

#### 4. Vendor Dashboard (`/admin/vendor` or same `/admin/dashboard`)
**Priority: HIGH**
- [ ] Vendor View:
  - My total sales
  - My revenue (after commission)
  - My bundles count
  - My total flashcards
  - Recent orders (their bundles only)
  - Performance chart
- [ ] Use `get_vendor_stats()` function
- [ ] Role detection logic:
  ```typescript
  if (userRole === 'vendor') {
    // Show vendor-specific stats
  } else if (userRole === 'super_admin') {
    // Show global stats
  }
  ```

#### 5. Admin Navigation Updates
**Priority: MEDIUM**
- [ ] Update `/components/admin/admin-nav.tsx`
- [ ] Add "Bundles" menu item (for vendors/super admin)
- [ ] Add "Orders" menu item (for all roles)
- [ ] Add "Vendors" menu item (super admin only)
- [ ] Conditionally hide menu items based on role

---

## 🎯 Phase 3: Frontend & User Experience

### Public-Facing Pages

#### 1. Marketplace/Shop Page (`/marketplace` or `/shop`)
**Priority: HIGH**
- [ ] Grid of available bundles
- [ ] Filters: city, category, price range
- [ ] Search functionality
- [ ] Sort: newest, popular, price
- [ ] Bundle cards showing:
  - Title, city, category
  - Price
  - Number of cards
  - Author/vendor name
  - Rating (if implemented)
  - "View Details" button

#### 2. Bundle Detail Page (`/bundles/[slug]`)
**Priority: HIGH**
- [ ] Bundle information display
- [ ] Sample flashcard preview (1-2 cards)
- [ ] Remaining cards shown as locked
- [ ] Purchase button (mock for now)
- [ ] Author/vendor information
- [ ] Reviews section (optional)
- [ ] Related bundles

#### 3. Purchase Flow (Mock Implementation)
**Priority: MEDIUM**
- [ ] "Purchase Bundle" button
- [ ] Mock payment form
- [ ] Success page
- [ ] Backend: Create order + user_purchase records
- [ ] Redirect to "My Purchases" or bundle viewer

#### 4. User's Purchased Bundles Page (`/my-purchases`)
**Priority: MEDIUM**
- [ ] List of bundles user owns
- [ ] "Study Now" button for each
- [ ] Progress tracking (optional: cards studied, mastered, etc.)

#### 5. Flashcard Study Interface (`/study/[bundleId]`)
**Priority: MEDIUM**
- [ ] Load all flashcards for owned bundle
- [ ] Navigation: Next/Previous card
- [ ] Progress indicator (Card X of Y)
- [ ] "Shuffle" mode
- [ ] "Mark as Known/Unknown" (optional)
- [ ] Use the `FlipCard` component

---

## 🔒 Phase 4: Navigation & Layout Fixes

### Critical Fixes

#### 1. Global Layout (`app/layout.tsx`)
**Priority: HIGH**
- [ ] Ensure Navigation and Footer render on ALL pages
- [ ] Current issue: May be missing on some routes
- [ ] Solution: Verify layout hierarchy

#### 2. Missing Pages (Create Skeletons)
**Priority: MEDIUM**
- [ ] `/contact` - Contact form page
- [ ] `/terms` - Terms of Service
- [ ] `/privacy` - Privacy Policy
- [ ] `/about` - About the marketplace
- [ ] `/vendor-signup` - Vendor application form (optional)

#### 3. Fix Broken Links
**Priority: HIGH**
- [ ] Audit all navigation links
- [ ] Ensure all hrefs point to existing pages
- [ ] Add 404 page if missing

---

## 🎨 Phase 5: Polish & Advanced Features

### Nice-to-Have Features

#### 1. Vendor Application System
- [ ] Public vendor signup form
- [ ] Super admin approval interface
- [ ] Email notifications

#### 2. Reviews & Ratings
- [ ] Users can rate/review purchased bundles
- [ ] Display average rating on bundle cards
- [ ] Moderate reviews (super admin)

#### 3. Revenue Dashboard (Super Admin)
- [ ] Commission breakdown by vendor
- [ ] Monthly revenue charts
- [ ] Export financial reports

#### 4. Stripe Integration (Real Payments)
- [ ] Replace mock purchase with Stripe
- [ ] Webhook handling
- [ ] Refund system

#### 5. Analytics
- [ ] Bundle view counts
- [ ] Conversion rates
- [ ] Vendor performance insights

---

## 📋 Implementation Order (Recommended)

### Week 1: Admin Core
1. Bundle management admin page
2. Flashcard editor
3. Update admin navigation
4. Role-based dashboard (vendor vs super admin)

### Week 2: Public Marketplace
1. Marketplace/shop page
2. Bundle detail page
3. Mock purchase flow
4. My Purchases page

### Week 3: Study & Polish
1. Flashcard study interface
2. Fix navigation/layout globally
3. Create missing pages (contact, terms, privacy)
4. Fix broken links

### Week 4: Testing & Refinement
1. End-to-end testing
2. Security audit (RLS policies)
3. Performance optimization
4. User feedback & iteration

---

## 🔐 Security Checklist

Before going live:
- [ ] Verify RLS policies block unauthorized access
- [ ] Test vendor isolation (vendor A can't edit vendor B's content)
- [ ] Test super admin permissions
- [ ] Validate role assignment (prevent privilege escalation)
- [ ] Sanitize user inputs (XSS prevention)
- [ ] Rate limiting on API endpoints
- [ ] HTTPS in production

---

## 📦 Database Migration Steps

1. **Run the marketplace schema:**
   ```bash
   # In Supabase SQL Editor
   supabase-marketplace-schema.sql
   ```

2. **Set up first super admin:**
   ```sql
   UPDATE profiles
   SET role = 'super_admin', is_approved = true
   WHERE email = 'your-admin-email@example.com';
   ```

3. **Create sample vendor (for testing):**
   ```sql
   UPDATE profiles
   SET role = 'vendor', is_approved = true, vendor_city = 'Paris'
   WHERE email = 'test-vendor@example.com';
   ```

4. **Create sample bundle:**
   ```sql
   INSERT INTO bundles (title, slug, description, price, city, author_id, is_published)
   VALUES (
     'Paris Metro Mastery',
     'paris-metro-mastery',
     'Master the Paris Metro with essential tips',
     9.99,
     'Paris',
     'vendor-user-id-here',
     true
   );
   ```

---

## 🎯 Success Metrics

Track these to measure platform health:
- Number of active vendors
- Total bundles published
- Conversion rate (views → purchases)
- Average bundle price
- Total platform revenue
- Customer satisfaction (reviews/ratings)

---

## 📞 Support & Questions

For development questions or issues:
1. Check RLS policies if data access is blocked
2. Verify user role is set correctly
3. Ensure `.env.local` has correct Supabase credentials
4. Check browser console for TypeScript errors

---

**Last Updated:** 2026-01-08
**Current Commit:** `3dbed84` - Multi-Vendor Marketplace Foundation (Phase 1)
