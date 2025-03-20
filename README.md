# City Navigation Component

A flexible and accessible navigation component for displaying city options with optional timezone support.

## Features

- Accessible navigation with ARIA roles and keyboard support
- Optional timezone display with automatic timezone property detection
- Smooth sliding indicator for active selection

## Usage

### Basic Implementation

```html
<div class="city-navigation-component"></div>
```

```javascript
const cities = [
  { section: 'nyc', label: 'New York' },
  { section: 'la', label: 'Los Angeles' },
  { section: 'chi', label: 'Chicago' },
];

const wrapper = document.querySelector('.city-navigation-component');
new CityNavigationComponent(wrapper, cities);
```

### With Timezone Support

```javascript
const citiesWithTimezones = [
  { section: 'nyc', label: 'New York', timezone: 'America/New_York' },
  { section: 'la', label: 'Los Angeles', timezone: 'America/Los_Angeles' },
  { section: 'chi', label: 'Chicago', timezone: 'America/Chicago' },
];

const wrapper = document.querySelector('.city-navigation-component');
new CityNavigationComponent(wrapper, citiesWithTimezones);
```

## Timezone Support

The component automatically detects if all cities have timezone information:

- If all cities have a `timezone` property, the component will display the current time for the selected city
- If any city is missing the `timezone` property, the time display feature will be disabled
- Time updates every minute to stay current

## Accessibility

- Uses semantic HTML elements (`nav`, `button`)
- Implements ARIA roles and attributes for proper screen reader support
- Keyboard navigation with focus management
- Thoughtfully styled focus indicators for better keyboard accessibility

## Notes/Thoughts

- Consider implementing responsive layouts for mobile devices (e.g., multi-row support)
- Future improvements could include:
  - Maximum number of cities limit
  - Custom styling options
  - Additional time format options

## Dependencies

None! This is a vanilla JavaScript component with no external dependencies.
