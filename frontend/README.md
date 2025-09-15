# Telemedicine Frontend

A React + Vite application for telemedicine services with a consistent design system.

## Theme System

The application uses a comprehensive CSS custom properties (CSS variables) based theme system defined in `src/index.css`. This ensures visual consistency across all components and pages.

### Available Theme Tokens

#### Colors
- **Background**: `--color-bg`, `--color-surface`, `--color-surface-muted`
- **Text**: `--color-text`, `--color-text-muted`, `--color-white`
- **Primary Brand**: `--color-primary` (and variants 50-900)
- **Semantic**: `--color-success`, `--color-warning`, `--error`, `--color-info`
- **Borders**: `--color-border`

#### Typography
- **Font Families**: `--font-family-base`, `--font-family-heading`
- **Font Weights**: `--font-weight-normal`, `--font-weight-medium`, `--font-weight-semibold`, `--font-weight-bold`
- **Line Height**: `--line-height-base`

#### Spacing
- **Scale**: `--spacing-xs` (0.25rem) to `--spacing-2xl` (3rem)

#### Layout
- **Border Radius**: `--radius-sm` to `--radius-xl`
- **Shadows**: `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`
- **Focus Ring**: `--focus-ring`
- **Transitions**: `--transition-fast`, `--transition-normal`, `--transition-slow`

### Usage Examples

```css
/* Use theme colors */
.my-component {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

/* Use spacing scale */
.my-button {
  padding: var(--spacing-sm) var(--spacing-lg);
  margin: var(--spacing-md) 0;
}

/* Use consistent shadows and radius */
.card {
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

/* Use theme transitions */
.interactive {
  transition: all var(--transition-normal);
}
```

### Button Classes
The theme provides ready-to-use button classes:
- `.btn-primary` - Primary brand button
- `.btn-secondary` - Secondary outline button

## Development

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
