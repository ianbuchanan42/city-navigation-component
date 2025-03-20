# City Navigation Component

A lightweight, accessible navigation component for displaying city options with a smooth sliding bar animation.

## Usage

```html
<section class="city-navigation-section" aria-labelledby="city-nav-heading">
  <h2 id="city-nav-heading" class="visually-hidden">City Navigation</h2>
  <div class="city-navigation-component"></div>
</section>

<script src="script.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const navigation = new CityNavigation();
    navigation.init();
  });
</script>
```

## Key Features

- **Accessibility First**: Built with semantic HTML and ARIA attributes
- **Keyboard Navigation**: Full tab support with visible focus indicators
- **Smooth Animations**: Sliding bar transitions on city selection
- **Responsive Design**: Adapts to different screen sizes
- **Error Handling**: Graceful fallbacks for data loading issues
- **Zero Dependencies**: Built with vanilla JavaScript and CSS

## Implementation Notes

- The sliding bar is positioned using `getBoundingClientRect()` for precise placement
- Event delegation with `closest()` for efficient click handling
- Focus-visible styling provides clear visual feedback for keyboard navigation
- Component maintains state for active city selection

## Dependencies

None! This component is built with vanilla JavaScript and CSS.
