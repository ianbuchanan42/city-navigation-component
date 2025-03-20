class CityNavigationComponent {
  constructor(wrapper) {
    this.wrapper = wrapper;
    this.navItems = [];
    this.slidingBar = null;
    this.currentCity = null;
    this.init();
  }

  async init() {
    try {
      const response = await fetch('navigation.json');
      const data = await response.json();
      this.cities = data.cities;
      this.createStructure();
      this.renderNavigation();
      this.setupEventListeners();
      this.updateSlidingBar();
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
    // Create and append the buttons
    this.cities.forEach((city, index) => {
      const button = this.createButton(city, index);
      this.navItems.appendChild(button);
    });
    // Set most left city as current city
    this.currentCity = this.cities[0];
    // Set the sliding bar under the current city
    this.updateSlidingBar();
  }

  // Setup event listeners
  // closest() is a nice selector that allows us to select the closest parent element
  // that matches the selector from the target element
  // in this case the button that was clicked
  // it's a great way to avoid event bubbling
  setupEventListeners() {
    this.navItems.addEventListener('click', (e) => {
      const navItem = e.target.closest('.nav-item');
      if (navItem) {
        this.selectCity(navItem.dataset.section);
      }
    });

    // mainly for testing purposes
    window.addEventListener('resize', () => {
      this.updateSlidingBar();
    });
  }

  selectCity(section) {
    const navItems = this.navItems.querySelectorAll('.nav-item');
    navItems.forEach((item) => {
      item.classList.remove('active');
      item.setAttribute('aria-selected', 'false');
      if (item.dataset.section === section) {
        item.classList.add('active');
        item.setAttribute('aria-selected', 'true');
      }
    });

    this.currentCity = this.cities.find((city) => city.section === section);
    this.updateSlidingBar();
  }

  // Update the sliding bar under the current city
  // getBoundingClientRect() was a fun discovery!
  // it returns the size of an element and its position relative to the viewport.
  // with this we can calculate the width and position of the sliding bar
  // and update it when the current city changes
  updateSlidingBar() {
    const activeItem = this.navItems.querySelector('.nav-item.active');
    if (activeItem) {
      // get the activeItem so we can set its new width
      const rect = activeItem.getBoundingClientRect();
      // get the navItems so we can set the sliding bar's position relative to it
      const navRect = this.navItems.getBoundingClientRect();
      // set the width of the sliding bar to the width of the activeItem
      this.slidingBar.style.width = `${rect.width}px`;
      // set the position of the sliding bar to the position of the activeItem relative to the navItems
      this.slidingBar.style.left = `${rect.left - navRect.left}px`;
    }
  }
}

// Initialize the navigation when the DOM is loaded and ready to go!
document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.city-navigation-component');
  if (wrapper) {
    new CityNavigationComponent(wrapper);
  }
});
