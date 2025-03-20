class CityNavigationComponent {
  constructor(wrapper) {
    this.wrapper = wrapper;
    this.navItems = [];
    this.slidingBar = null;
    this.init();
  }

  async init() {
    try {
      const response = await fetch('navigation.json');
      const data = await response.json();
      this.cities = data.cities;
      this.createStructure();
      this.renderNavigation();
    } catch (error) {
      console.error('Error loading navigation data:', error);
      // Create semantic error message
      const errorMessage = document.createElement('p');

      errorMessage.setAttribute('role', 'alert');
      errorMessage.setAttribute('aria-live', 'polite');
      errorMessage.classList.add('error');
      errorMessage.innerText =
        'We were unable to load the city navigation data. Please try refreshing the page.';
      this.wrapper.appendChild(errorMessage);
    }
  }

  createStructure() {
    // Create the navigation container
    const navigation = document.createElement('nav');
    navigation.classList.add('city-nav');
    navigation.setAttribute('aria-label', 'City selection');

    // Create the navigation items container
    const navItems = document.createElement('div');
    navItems.classList.add('nav-items');
    navItems.setAttribute('role', 'tablist');

    // Create the navigation bar container
    const navBarContainer = document.createElement('div');
    navBarContainer.classList.add('nav-bar-container');

    // Create background bar
    const navBarBackground = document.createElement('div');
    navBarBackground.classList.add('nav-bar-background');

    // Create the sliding bar
    const slidingBar = document.createElement('div');
    slidingBar.classList.add('sliding-bar');
    slidingBar.setAttribute('aria-hidden', 'true');

    // Assemble the navigation
    navBarContainer.appendChild(navBarBackground);
    navBarContainer.appendChild(slidingBar);
    navigation.appendChild(navItems);
    navigation.appendChild(navBarContainer);
    this.wrapper.appendChild(navigation);

    // Store references
    this.navItems = navItems;
    this.slidingBar = slidingBar;
  }

  createButton(city, index) {
    const button = document.createElement('button');
    button.classList.add('nav-item');
    if (index === 0) {
      button.classList.add('active');
    }
    button.setAttribute('data-section', city.section);
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', index === 0);
    button.textContent = city.label;
    return button;
  }

  renderNavigation() {
    // Clear existing content just in case!
    this.navItems.innerHTML = '';

    // Create and append the buttons
    this.cities.forEach((city, index) => {
      const button = this.createButton(city, index);
      this.navItems.appendChild(button);
    });

    this.currentCity = this.cities[0];
  }
}

// Initialize the navigation when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.city-navigation-component');
  if (wrapper) {
    new CityNavigationComponent(wrapper);
  }
});
