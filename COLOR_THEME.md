# Dressen Color Palette Implementation

## Color Palette Overview

| Color Name | Hex Code | Usage | Tailwind Classes |
|------------|----------|-------|------------------|
| **Primary (Gold Gradient)** | `#D4A017` | Buttons, highlights, section titles | `bg-primary`, `text-primary`, `border-primary` |
| **Secondary (Charcoal Black)** | `#1E1E1E` | Text, icons, header background | `bg-secondary`, `text-secondary`, `border-secondary` |
| **Accent (Soft White)** | `#F8F8F8` | Clean neutral background | `bg-accent`, `text-accent`, `border-accent` |
| **Neutral Gray** | `#E5E5E5` | Borders, dividers, subtle UI elements | `bg-neutral`, `text-neutral`, `border-neutral` |
| **Highlight Accent (Royal Blue)** | `#3B5BA9` | Contrast buttons, links (use sparingly) | `bg-highlight`, `text-highlight`, `border-highlight` |

## Implementation Status

### ✅ Completed
- [x] Tailwind configuration updated with custom color palette
- [x] Global CSS variables updated
- [x] Button component variants updated
- [x] Navbar component colors updated
- [x] Dark mode color scheme implemented
- [x] Color utility file created (`src/utils/colors.ts`)

### 🔄 Next Steps
- [ ] Update footer component
- [ ] Update card components
- [ ] Update form components
- [ ] Update product listing components
- [ ] Update dashboard components
- [ ] Update authentication pages

## Usage Examples

### Buttons
```tsx
// Primary gold button
<Button variant="default">Primary Action</Button>

// Secondary charcoal button  
<Button variant="secondary">Secondary Action</Button>

// Highlight blue button (use sparingly)
<Button variant="highlight">Special Action</Button>

// Outline button
<Button variant="outline">Outline Button</Button>
```

### Text Colors
```tsx
// Primary text (charcoal)
<p className="text-secondary">Main content text</p>

// Secondary text (lighter charcoal)
<p className="text-secondary-600">Supporting text</p>

// Highlight text (royal blue)
<p className="text-highlight">Important links</p>
```

### Backgrounds
```tsx
// Clean white background
<div className="bg-accent">Content area</div>

// Gold accent background
<div className="bg-primary">Header or highlight section</div>

// Charcoal background
<div className="bg-secondary">Dark sections</div>
```

### Borders and Dividers
```tsx
// Neutral borders
<div className="border border-neutral">Card with subtle border</div>

// Gold accent borders
<div className="border border-primary">Highlighted card</div>
```

## Color Combinations

### Recommended Pairings
- **Gold + Charcoal**: `bg-primary text-secondary` (Primary buttons)
- **Charcoal + Soft White**: `bg-secondary text-accent` (Dark sections)
- **Soft White + Charcoal**: `bg-accent text-secondary` (Main content areas)
- **Royal Blue + Soft White**: `bg-highlight text-accent` (Special actions)

### Hover States
- **Primary hover**: `hover:bg-primary-600`
- **Secondary hover**: `hover:bg-secondary-800`
- **Highlight hover**: `hover:bg-highlight-800`
- **Neutral hover**: `hover:bg-neutral-400`

## Accessibility Notes

- All color combinations meet WCAG AA contrast requirements
- Focus states use gold (`ring-primary`) for consistency
- Error states maintain red color for universal recognition
- Dark mode maintains the same color relationships with adjusted brightness

## File Locations

- **Tailwind Config**: `tailwind.config.ts`
- **Global Styles**: `src/app/globals.css`
- **Color Utilities**: `src/utils/colors.ts`
- **Button Component**: `src/components/ui/button.tsx`
- **Navbar Component**: `src/components/modules/Navbar/Navbar.tsx`

## Migration Guide

When updating existing components:

1. Replace hardcoded hex colors with Tailwind classes
2. Use `text-secondary` instead of `text-black` or `text-gray-900`
3. Use `bg-accent` instead of `bg-white`
4. Use `border-neutral` instead of `border-gray-200`
5. Use `text-highlight` for important links instead of blue variants
6. Use `bg-primary` for main action buttons

## CSS Variables Available

```css
--primary: #D4A017
--secondary: #1E1E1E  
--accent: #F8F8F8
--neutral: #E5E5E5
--highlight: #3B5BA9
```

These can be used in custom CSS when Tailwind classes aren't sufficient.