# BookNest Design System

## Overview
This document outlines the comprehensive design system for the BookNest project, providing guidelines for consistent UI implementation across all components and screens.

## Color Palette

### Primary Colors
- **Primary 50**: `#eff6ff` - Lightest blue, used for backgrounds
- **Primary 100**: `#dbeafe` - Very light blue, used for hover states
- **Primary 200**: `#bfdbfe` - Light blue, used for borders and accents
- **Primary 300**: `#93c5fd` - Medium light blue, used for secondary elements
- **Primary 400**: `#60a5fa` - Medium blue, used for interactive elements
- **Primary 500**: `#2A48DE` - Main brand color, used for primary actions
- **Primary 600**: `#2563eb` - Darker blue, used for hover states
- **Primary 700**: `#1d4ed8` - Dark blue, used for active states
- **Primary 800**: `#1e40af` - Very dark blue, used for text
- **Primary 900**: `#1e3a8a` - Darkest blue, used for emphasis

### Secondary Colors
- **Secondary 50**: `#f8fafc` - Lightest gray, used for backgrounds
- **Secondary 100**: `#f1f5f9` - Very light gray, used for cards
- **Secondary 200**: `#e2e8f0` - Light gray, used for borders
- **Secondary 300**: `#cbd5e1` - Medium light gray, used for dividers
- **Secondary 400**: `#94a3b8` - Medium gray, used for placeholder text
- **Secondary 500**: `#64748b` - Gray, used for secondary text
- **Secondary 600**: `#475569` - Dark gray, used for body text
- **Secondary 700**: `#334155` - Very dark gray, used for headings
- **Secondary 800**: `#1e293b` - Darkest gray, used for emphasis
- **Secondary 900**: `#0f172a` - Almost black, used for primary text

### Accent Colors
- **Accent 500**: `#d946ef` - Purple, used for special actions
- **Success 500**: `#22c55e` - Green, used for success states
- **Warning 500**: `#f59e0b` - Yellow, used for warning states
- **Error 500**: `#ef4444` - Red, used for error states

## Typography

### Font Families
- **Primary**: Montserrat (sans-serif)
- **Monospace**: JetBrains Mono
- **Display**: Montserrat (for headings)

### Font Sizes
- **Heading 1**: `3xl` to `5xl` (1.875rem to 3rem)
- **Heading 2**: `2xl` to `4xl` (1.5rem to 2.25rem)
- **Heading 3**: `xl` to `3xl` (1.25rem to 1.875rem)
- **Body Large**: `lg` (1.125rem)
- **Body Medium**: `base` (1rem)
- **Body Small**: `sm` (0.875rem)
- **Caption**: `xs` (0.75rem)

### Typography Classes
```css
.heading-1    /* Main page titles */
.heading-2    /* Section headers */
.heading-3    /* Subsection headers */
.body-large   /* Important body text */
.body-medium  /* Regular body text */
.body-small   /* Secondary information */
.caption      /* Metadata, timestamps */
```

## Spacing System

### Container Spacing
- **Container Responsive**: Automatically centers content with responsive padding
- **Section Padding**: `py-8` to `py-20` based on screen size
- **Grid Responsive**: Responsive grid with consistent gaps

### Spacing Scale
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)
- **3xl**: 4rem (64px)

## Component Patterns

### Buttons
```css
.btn-primary    /* Primary actions */
.btn-secondary  /* Secondary actions */
.btn-ghost      /* Subtle actions */
.btn-danger     /* Destructive actions */
.btn-success    /* Positive actions */
```

### Cards
```css
.card           /* Basic card with shadow */
.card-hover     /* Card with hover effects */
.card-interactive /* Clickable card */
```

### Inputs
```css
.input-primary  /* Standard input */
.input-error    /* Input with error state */
.input-success  /* Input with success state */
```

### Badges
```css
.badge          /* Base badge */
.badge-primary  /* Primary badge */
.badge-success  /* Success badge */
.badge-warning  /* Warning badge */
.badge-error    /* Error badge */
.badge-secondary /* Secondary badge */
```

### Status Indicators
```css
.status-pending   /* Pending status */
.status-approved  /* Approved status */
.status-rejected  /* Rejected status */
.status-active    /* Active status */
.status-sold      /* Sold status */
```

## Layout Utilities

### Container Classes
```css
.container-responsive  /* Responsive container with auto margins */
.section-padding      /* Consistent section spacing */
.grid-responsive      /* Responsive grid system */
```

### Responsive Design
- **Mobile First**: Design starts with mobile and scales up
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
- **Flexible Layouts**: Use flexbox and grid for responsive layouts
- **Touch Friendly**: Minimum 44px touch targets

## Animation System

### Animation Classes
```css
.animate-fade-in        /* Fade in from top */
.animate-slide-up       /* Slide up from bottom */
.animate-scale-in       /* Scale in from center */
.animate-slide-in-right /* Slide in from right */
.animate-bounce-gentle  /* Gentle bounce animation */
.animate-pulse-gentle   /* Gentle pulse animation */
```

### Transition Durations
- **Fast**: 200ms (hover states)
- **Medium**: 300ms (card interactions)
- **Slow**: 600ms (page transitions)

## Shadow System

### Shadow Classes
```css
.shadow-soft    /* Subtle shadow for cards */
.shadow-medium  /* Medium shadow for elevated elements */
.shadow-large   /* Large shadow for modals */
.shadow-glow    /* Glowing shadow for primary elements */
```

## Focus States

### Focus Ring Classes
```css
.focus-ring           /* Primary focus ring */
.focus-ring-secondary /* Secondary focus ring */
```

## Loading States

### Skeleton Classes
```css
.skeleton        /* Base skeleton */
.skeleton-text   /* Text skeleton */
.skeleton-image  /* Image skeleton */
```

## Interactive Elements

### Link Classes
```css
.link-primary    /* Primary links */
.link-secondary  /* Secondary links */
```

## Implementation Guidelines

### 1. Responsive Design
- Always use responsive units (%, vh, vw, rem)
- Implement mobile-first design approach
- Test on multiple screen sizes

### 2. Accessibility
- Maintain proper color contrast ratios
- Use semantic HTML elements
- Implement proper focus states
- Provide alt text for images

### 3. Performance
- Use CSS transforms for animations
- Implement lazy loading for images
- Minimize CSS bundle size

### 4. Consistency
- Use predefined color classes
- Follow typography hierarchy
- Maintain consistent spacing
- Use standard component patterns

## Example Usage

### Card Component
```jsx
<div className="card card-hover animate-fade-in">
  <div className="p-6">
    <h3 className="heading-3 mb-4">Card Title</h3>
    <p className="body-medium text-secondary-600 mb-4">
      Card description text
    </p>
    <button className="btn-primary">Action Button</button>
  </div>
</div>
```

### Form Input
```jsx
<div className="space-y-2">
  <label className="font-medium text-secondary-800">Input Label</label>
  <input 
    type="text" 
    className="input-primary focus-ring"
    placeholder="Enter text..."
  />
</div>
```

### Status Badge
```jsx
<span className="badge badge-success">Approved</span>
```

## Browser Support
- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- Mobile browsers (iOS Safari 14+, Chrome Mobile 90+)
- Progressive enhancement for older browsers

## Testing Checklist
- [ ] Responsive design on all breakpoints
- [ ] Accessibility compliance (WCAG 2.1 AA)
- [ ] Cross-browser compatibility
- [ ] Performance optimization
- [ ] Touch device usability
- [ ] Keyboard navigation
- [ ] Screen reader compatibility

## Future Enhancements
- Dark mode support
- Advanced animation presets
- Component library documentation
- Design token export
- Figma integration
- Automated accessibility testing
