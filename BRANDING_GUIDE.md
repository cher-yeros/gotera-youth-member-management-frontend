# Gotera Youth Branding System

## Overview

The Gotera Youth Member Management System uses a comprehensive blue and purple branding system that is fully reusable and customizable.

## Color Palette

### Primary Colors

- **Blue**: `#3b82f6` (Primary brand color)
- **Purple**: `#a855f7` (Secondary brand color)

### Color Variations

The system includes full color scales (50-950) for both blue and purple, ensuring consistency across all components.

## Theme System

### Light Theme

- Background: `#fafafa`
- Foreground: `#171717`
- Primary: `#3b82f6`
- Secondary: `#a855f7`
- Accent: `#f3e8ff`

### Dark Theme

- Background: `#0a0a0a`
- Foreground: `#fafafa`
- Primary: `#60a5fa`
- Secondary: `#c084fc`
- Accent: `#6b21a8`

## CSS Classes

### Brand Gradients

```css
.bg-brand-gradient          /* Blue to purple gradient */
/* Blue to purple gradient */
.bg-brand-gradient-reverse  /* Purple to blue gradient */
.bg-brand-subtle           /* Light gradient for backgrounds */
.text-brand-gradient; /* Gradient text effect */
```

### Brand Effects

```css
.shadow-brand              /* Brand-colored shadow */
/* Brand-colored shadow */
.shadow-brand-lg           /* Large brand shadow */
.hover-brand-glow          /* Glow effect on hover */
.focus-brand-ring; /* Brand-colored focus ring */
```

## Components

### ThemeProvider

Provides theme context and color management:

```tsx
import { ThemeProvider } from "@/theme/ThemeProvider";

<ThemeProvider>
  <App />
</ThemeProvider>;
```

### ThemeToggle

Switch between light and dark themes:

```tsx
import ThemeToggle from '@/components/ui/theme-toggle';

<ThemeToggle variant="icon" />
<ThemeToggle variant="default" />
```

### Brand Components

Pre-built components with brand styling:

#### BrandLogo

```tsx
import { BrandLogo } from "@/components/brand";

<BrandLogo size="lg" showText={true} />;
```

#### BrandButton

```tsx
import { BrandButton } from "@/components/brand";

<BrandButton variant="primary" size="lg">
  Click Me
</BrandButton>;
```

#### BrandCard

```tsx
import { BrandCard } from "@/components/brand";

<BrandCard variant="gradient" hover={true}>
  Content
</BrandCard>;
```

#### BrandBadge

```tsx
import { BrandBadge } from "@/components/brand";

<BrandBadge variant="primary" size="md">
  New
</BrandBadge>;
```

#### BrandInput

```tsx
import { BrandInput } from "@/components/brand";

<BrandInput variant="outlined" placeholder="Enter text..." />;
```

## Usage Examples

### Dashboard with Branding

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ThemeToggle from "@/components/ui/theme-toggle";

const Dashboard = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-brand-gradient">
        Gotera Youth Dashboard
      </h1>
      <ThemeToggle />
    </div>

    <Card className="shadow-brand hover-brand-glow">
      <CardHeader>
        <CardTitle className="text-brand-gradient">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <Button className="bg-brand-gradient hover:opacity-90">
          Add Member
        </Button>
      </CardContent>
    </Card>
  </div>
);
```

### Login Page with Branding

```tsx
const Login = () => (
  <div className="min-h-screen bg-brand-subtle flex items-center justify-center">
    <Card className="shadow-brand-lg">
      <CardHeader className="text-center">
        <h1 className="text-4xl font-bold text-brand-gradient">Gotera Youth</h1>
      </CardHeader>
      <CardContent>
        <Input className="focus-brand-ring" />
        <Button className="w-full bg-brand-gradient">Sign In</Button>
      </CardContent>
    </Card>
  </div>
);
```

## Customization

### Adding New Brand Colors

Update the `brand.ts` file:

```tsx
export const brandColors = {
  // Add new color scales
  teal: {
    50: "#f0fdfa",
    500: "#14b8a6",
    900: "#134e4a",
  },
};
```

### Creating Custom Brand Components

```tsx
import { cn } from "@/lib/utils";
import { useBrandColors } from "@/components/brand";

const CustomBrandComponent = ({ className, ...props }) => {
  const { colors } = useBrandColors();

  return (
    <div
      className={cn("bg-brand-gradient", className)}
      style={{
        backgroundColor: colors.primary,
        color: colors.primaryForeground,
      }}
      {...props}
    />
  );
};
```

## Best Practices

1. **Consistency**: Always use the provided brand colors and components
2. **Accessibility**: Ensure sufficient contrast ratios
3. **Responsiveness**: Test branding across all screen sizes
4. **Theme Support**: Always support both light and dark themes
5. **Performance**: Use CSS classes over inline styles when possible

## File Structure

```
src/
├── theme/
│   ├── brand.ts              # Color definitions
│   └── ThemeProvider.tsx     # Theme context
├── components/
│   ├── brand/
│   │   ├── BrandComponents.tsx
│   │   └── index.ts
│   └── ui/
│       └── theme-toggle.tsx
└── index.css                 # CSS variables and utilities
```

This branding system provides a complete, reusable solution for maintaining consistent visual identity across the Gotera Youth Member Management System.
