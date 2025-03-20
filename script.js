class CityNavigationComponent {
  constructor(wrapper, cities) {
    this.wrapper = wrapper;
    this.cities = cities;
    this.navItems = [];
    this.slidingBar = null;
    this.currentCity = null;
    this.init();
  }

  async init() {
    this.createStructure();
    this.renderNavigation();
    this.setupEventListeners();
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
  // Create a button for each city
  createButton(city, index) {
    // Create a button element for each city
    const button = document.createElement('button');
    button.classList.add('nav-item');

    // Set the first button as active by default
    // This ensures we have a valid initial state for the navigation
    if (index === 0) {
      button.classList.add('active');
    }

    // Store the section identifier for click handling
    // This allows us to map clicks to specific city sections
    button.setAttribute('data-section', city.section);

    // ARIA attributes for accessibility
    // role="tab" indicates this is part of a tablist navigation
    // aria-selected indicates the current active state
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', index === 0);

    // Set the visible text label
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
    // this fixes the problem of the user seeing the sliding bar snap into place from the left side
    // when the page loads
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

  // Select the city
  selectCity(section) {
    // Get all navigation items to update their states
    const navItems = this.navItems.querySelectorAll('.nav-item');

    // Update each navigation item's state
    navItems.forEach((item) => {
      // Remove active state from all items first
      // This ensures only one item can be active at a time
      item.classList.remove('active');
      item.setAttribute('aria-selected', 'false');

      // If this is the selected item, mark it as active
      // We use dataset.section to match the city data structure
      if (item.dataset.section === section) {
        item.classList.add('active');
        item.setAttribute('aria-selected', 'true');
      }
    });

    // Update the current city reference for state management
    this.currentCity = this.cities.find((city) => city.section === section);

    // Enable smooth transition animation for the sliding bar
    // This is added before position update to ensure animation works
    this.slidingBar.classList.add('transition');

    // Update the sliding bar position to match the new active item
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
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Simulate error for testing
    // Uncomment the next line to test error state
    //throw new Error('Test error');
    // Fetch Cities
    const response = await fetch('navigation.json');
    const { cities } = await response.json();
    // Select element to attach the city navigation component to
    const wrapper = document.querySelector('.city-navigation-component');
    // Create and initialize the city navigation component passing in the wrapper and cities
    new CityNavigationComponent(wrapper, cities);
  } catch (error) {
    const wrapper = document.querySelector('.city-navigation-component');
    const errorMessage = document.createElement('div');
    errorMessage.setAttribute('role', 'alert');
    errorMessage.setAttribute('aria-live', 'polite');
    errorMessage.classList.add('error-message');
    errorMessage.innerHTML = `
      <p>Unable to load city navigation. Please try again.</p>
    `;
    wrapper.appendChild(errorMessage);
  }
});
