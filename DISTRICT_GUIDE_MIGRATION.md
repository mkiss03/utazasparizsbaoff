# District Guide Migration Strategy

## Overview

This document outlines the migration strategy from the existing point-based map system to the new district-based Paris Arrondissement Guide.

## Current System Analysis

### Existing Map System (`map_points` table)
- **Type:** Point-based markers on a metro map image
- **Content Types:** transport, ticket, info, survival, apps, situations
- **Purpose:** Metro navigation tips and practical information
- **Data Structure:**
  ```typescript
  interface MapPoint {
    id: string
    title: string
    x: number // percentage position
    y: number
    type: string
    color: string
    question: string
    answer: string
    details: string
    pros?: string
    usage_steps?: string
    tip?: string
  }
  ```

### New District System (`district_guides` table)
- **Type:** Geographic district-based guide
- **Content Types:** standard, rich_ticket, rich_list
- **Purpose:** Neighborhood exploration and tourist guidance
- **Data Structure:**
  ```typescript
  interface DistrictGuide {
    id: string
    district_number: number // 1-20
    title: string
    subtitle?: string
    description?: string
    highlights?: string[]
    content_layout: 'standard' | 'rich_ticket' | 'rich_list'
    sort_order: number
    is_active: boolean
    main_attraction?: string
    local_tips?: string
    best_for?: string[]
    avoid_tips?: string
    accent_color?: string
    icon_name?: string
    cover_image_url?: string
    gallery_images?: string[]
  }
  ```

## Migration Decision: Keep Both Systems

**Recommendation:** Keep both systems running in parallel.

### Reasoning:
1. **Different Purposes:** The map_points system serves metro/transport navigation, while district_guides serves neighborhood exploration
2. **Complementary Content:** Transport tips are not tied to specific districts
3. **No Content Overlap:** Existing map points don't map directly to district content
4. **User Experience:** Both views provide unique value to users

## Implementation Steps

### Step 1: Apply Database Migration

Run the SQL migration to create the `district_guides` table:

```bash
# Using Supabase CLI
supabase db push

# Or run manually in Supabase SQL Editor
# Copy contents of supabase-district-guide-schema.sql
```

### Step 2: Verify Table Creation

```sql
-- Check if table exists and has data
SELECT COUNT(*) FROM district_guides;

-- View sample data
SELECT district_number, title, is_active
FROM district_guides
ORDER BY sort_order;
```

### Step 3: Customize Initial Data

The migration includes default content for all 20 arrondissements. Customize via:

1. **Admin Panel:** Navigate to `/admin/districts`
2. **Direct SQL:** Update specific districts as needed

```sql
-- Example: Update District 7 with custom content
UPDATE district_guides
SET
  description = 'Your custom description here...',
  local_tips = 'Your local tips...',
  main_attraction = 'Your main attraction...',
  highlights = ARRAY['Highlight 1', 'Highlight 2', 'Highlight 3']
WHERE district_number = 7;
```

### Step 4: Add Component to Page

Add the `ParisDistrictGuide` component to your landing page:

```tsx
// app/page.tsx or relevant layout
import ParisDistrictGuide from '@/components/sections/ParisDistrictGuide'

export default function HomePage() {
  return (
    <main>
      {/* Other sections */}
      <ParisDistrictGuide />
      {/* Other sections */}
    </main>
  )
}
```

### Step 5: Configure Viewing Order

The `sort_order` field determines the sequence in the timeline navigation:

```sql
-- Example: Set custom viewing order (7 -> 18 -> 4 -> 1 -> 6)
UPDATE district_guides SET sort_order = 1 WHERE district_number = 7;  -- Eiffel
UPDATE district_guides SET sort_order = 2 WHERE district_number = 18; -- Montmartre
UPDATE district_guides SET sort_order = 3 WHERE district_number = 4;  -- Notre-Dame
UPDATE district_guides SET sort_order = 4 WHERE district_number = 1;  -- Louvre
UPDATE district_guides SET sort_order = 5 WHERE district_number = 6;  -- Saint-Germain
-- Continue for other districts...
```

## Content Migration from External Sources

If you have district content in another format (spreadsheet, document), here's a migration script template:

```sql
-- Template for bulk content update
UPDATE district_guides SET
  title = 'Custom Title',
  subtitle = 'Custom Subtitle',
  description = 'Custom description...',
  highlights = ARRAY['Highlight 1', 'Highlight 2'],
  main_attraction = 'Main attraction description',
  local_tips = 'Local tips and advice',
  best_for = ARRAY['Category 1', 'Category 2'],
  avoid_tips = 'What to avoid',
  content_layout = 'rich_ticket', -- or 'standard', 'rich_list'
  is_active = true
WHERE district_number = [NUMBER];
```

## Optional: Migrate Relevant Map Points to Districts

If some map_points content should be associated with districts:

```sql
-- Example: Check if any map points could inform district content
SELECT
  mp.title,
  mp.details,
  mp.tip
FROM map_points mp
WHERE mp.type IN ('info', 'survival');

-- Manually review and copy relevant content to district_guides
```

## Testing Checklist

- [ ] SQL migration applied successfully
- [ ] All 20 districts visible in admin panel
- [ ] Sort order works correctly in timeline
- [ ] Map SVG click navigation functions
- [ ] Content cards display properly
- [ ] Mobile responsiveness verified
- [ ] Animations smooth (no layout shifts)
- [ ] Database queries performant

## Rollback Plan

If issues arise, the district system can be disabled without affecting the map_points system:

```sql
-- Temporarily disable all districts
UPDATE district_guides SET is_active = false;

-- Or drop the table entirely (data loss warning)
DROP TABLE IF EXISTS district_guides;
```

## Files Created

| File | Purpose |
|------|---------|
| `supabase-district-guide-schema.sql` | Database migration |
| `lib/types/database.ts` | TypeScript types (updated) |
| `components/maps/ParisArrondissementsSVG.tsx` | SVG map component |
| `components/sections/ParisDistrictGuide.tsx` | Main section component |
| `app/admin/districts/page.tsx` | Admin management page |
| `components/admin/admin-nav.tsx` | Navigation (updated) |

## Future Enhancements

1. **Image Gallery:** Add cover images and gallery support
2. **Search:** Add district search functionality
3. **Favorites:** Let users mark favorite districts
4. **Routes:** Create suggested multi-district walking routes
5. **Events:** Link district content to local events/seasonal info
