# 🗺️ Draggable Map Component

An interactive, draggable map component with pinned markers for exploring a custom map image.

## 🎯 Features

- **Click & Drag Pan**: Users can click and drag to explore the map
- **Touch Support**: Works seamlessly on touch devices
- **Pinned Markers**: Metro stations stay fixed to specific map coordinates
- **Interactive Markers**: Click markers to highlight and center them
- **Bounds Checking**: Prevents over-dragging beyond visible edges
- **Smooth Animations**: Elegant transitions when releasing the drag
- **Legend Navigation**: Quick jump to markers via legend buttons
- **Responsive Design**: Adapts to different screen sizes

## 📁 Files

```
components/sections/
├── DraggableMapSection.tsx       # Main component
├── draggable-map-data.ts         # Marker data configuration
└── DRAGGABLE_MAP_README.md       # This file

app/
└── map-demo/
    └── page.tsx                  # Example usage page

public/images/
└── ujmetro.png                   # Map background (1536x1024)
```

## 🚀 Quick Start

### 1. Import the Component

```tsx
import DraggableMapSection from '@/components/sections/DraggableMapSection';
```

### 2. Use in Your Page

```tsx
export default function MyPage() {
  return (
    <main>
      <DraggableMapSection />
    </main>
  );
}
```

### 3. View the Demo

Navigate to `/map-demo` to see the component in action.

## ⚙️ Configuration

### Customizing Markers

Edit `components/sections/draggable-map-data.ts`:

```typescript
export interface MetroMarker {
  id: string;
  name: string;
  description: string;
  x: number; // Position as % (0-100) of image width
  y: number; // Position as % (0-100) of image height
}

export const metroMarkers: MetroMarker[] = [
  {
    id: 'station-1',
    name: 'Louvre-Rivoli',
    description: 'Közel a Louvre Múzeumhoz',
    x: 25,
    y: 35,
  },
  // Add more markers...
];
```

### Changing the Map Image

1. Place your image in `public/images/`
2. Update the image path in `DraggableMapSection.tsx`:

```tsx
<img
  src="/images/your-map.png"
  alt="Custom Map"
  // ...
/>
```

3. Update `MAP_WIDTH` and `MAP_HEIGHT` constants to match your image dimensions:

```tsx
const MAP_WIDTH = 1920;  // Your image width
const MAP_HEIGHT = 1080; // Your image height
```

### Customizing Container Height

Change the container height in the component:

```tsx
<div className="h-[500px] w-full ...">  {/* Change 500px */}
  {/* ... */}
</div>
```

### Adjusting Colors

The component uses Tailwind CSS with custom Parisian theme colors:

- `french-red-500` - Marker background
- `french-blue-500` - Selected state
- `parisian-grey-*` - Neutral colors
- `parisian-beige-*` - Background tints

Modify these in the component's className props.

## 🎨 Styling

The component follows the project's Parisian theme with:

- French Red (`#ED2939`) for markers
- French Blue (`#002395`) for interactive states
- Parisian beige/grey tones for backgrounds
- Glassmorphism effects on overlays

## 📱 Responsive Behavior

- **Desktop**: Full draggable experience with mouse
- **Mobile/Tablet**: Touch-friendly with native gestures
- **Container**: Max-width 6xl (1280px) centered with auto margins

## 🔧 Technical Details

### State Management

```tsx
const [isDragging, setIsDragging] = useState(false);
const [position, setPosition] = useState({ x: 0, y: 0 });
const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
```

### Event Handlers

- `handlePointerDown` - Initiates drag
- `handlePointerMove` - Updates position during drag
- `handlePointerUp` - Ends drag
- Global event listeners for smooth dragging outside container

### Bounds Calculation

```typescript
const getBounds = () => {
  const containerWidth = containerRef.current.offsetWidth;
  const containerHeight = containerRef.current.offsetHeight;

  return {
    minX: containerWidth - MAP_WIDTH,
    maxX: 0,
    minY: containerHeight - MAP_HEIGHT,
    maxY: 0,
  };
};
```

### Position Clamping

```typescript
const clampPosition = (x: number, y: number) => {
  const bounds = getBounds();
  return {
    x: Math.max(bounds.minX, Math.min(bounds.maxX, x)),
    y: Math.max(bounds.minY, Math.min(bounds.maxY, y)),
  };
};
```

## 🎯 Use Cases

1. **Tour Planning**: Show tour locations on a city map
2. **Metro Guide**: Highlight important metro stations
3. **Custom Maps**: Display any large image with interactive points
4. **Photo Galleries**: Create image exploration experiences
5. **Floor Plans**: Interactive building layouts

## 🚧 Future Enhancements

Potential improvements:

- [ ] Zoom in/out functionality
- [ ] Mini-map overview
- [ ] Search/filter markers
- [ ] Custom marker icons per type
- [ ] Animation paths between markers
- [ ] Integration with routing data
- [ ] Marker clustering for many points
- [ ] Export visited markers
- [ ] Fullscreen mode

## 📦 Dependencies

- **React 18+** - Core framework
- **TypeScript** - Type safety
- **Lucide React** - Icons (MapPin)
- **Tailwind CSS** - Styling
- **Next.js 14+** - App router

## 🤝 Integration with Existing Components

This component complements the existing `MetroMapSection.tsx` which uses an SVG-based curved line approach. Use:

- `MetroMapSection` - For stylized, branded metro line visualization
- `DraggableMapSection` - For realistic map exploration with panning

## 📄 License

Part of the utazasparizsbaoff project.

## 🐛 Troubleshooting

### Markers not positioning correctly

- Verify `x` and `y` percentages (0-100)
- Check `MAP_WIDTH` and `MAP_HEIGHT` match your image
- Ensure image has loaded (check browser dev tools)

### Drag feels laggy

- Reduce image size/optimize
- Consider lazy loading markers
- Check browser performance

### Map starts off-center

- The component auto-centers on mount
- Check container dimensions are stable

### Touch not working on mobile

- Ensure `touch-action: none` is not blocking
- Test `onTouchStart` event propagation
- Verify viewport meta tags in layout

---

**Created**: 2026-02-02
**Component Type**: Interactive Map
**Status**: Production Ready ✅
