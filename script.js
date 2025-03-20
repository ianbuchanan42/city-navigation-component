class CityNavigationComponent {
  constructor(wrapper, cities) {
    //element that the component is appended to
    this.wrapper = wrapper;
    //cities to display
    this.cities = cities;
    //array of navigation items
    this.navItems = [];
    //sliding bar that will slide under the active/current city
    this.slidingBar = null;
    //current city
    this.currentCity = null;
    //time interval to update the time display
    this.timeInterval = null;
    // detects if the cities have timezones, this will be used to determine if the time display should be shown
    this.hasTimezones = this.cities.every((city) => city.timezone);

    // remove any existing children from the wrapper
    this.wrapper.innerHTML = '';

    this.init();
  }

  async init() {
    // create element scaffolding
    this.createStructure();
    // render the navigation base on passed in cities
    this.renderNavigation();
    // setup event listeners for button clicks and window resize
    this.setupEventListeners();
    // update the time display
    this.startTimeUpdates();
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
    // unsure if it would be best to add aria-hidden true to a structural element that holds decorative elements
    const navBarContainer = document.createElement('div');
    navBarContainer.classList.add('nav-bar-container');

    // Create background bar
    const navBarBackground = document.createElement('div');
    navBarBackground.classList.add('nav-bar-background');
    navBarBackground.setAttribute('aria-hidden', 'true');

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

    // Create container for label and time
    const contentContainer = document.createElement('div');
    contentContainer.classList.add('button-content');

    // Set the visible text label
    const label = document.createElement('span');
    label.textContent = city.label;
    contentContainer.appendChild(label);

    // Add time display element only if all the cities have timezones
    if (this.hasTimezones) {
      const timeDisplay = document.createElement('span');
      timeDisplay.classList.add('time-display', 'hidden');
      timeDisplay.setAttribute('aria-live', 'polite');
      timeDisplay.setAttribute('role', 'status');
      contentContainer.appendChild(timeDisplay);
    }

    button.appendChild(contentContainer);
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

    // mainly for testing purposes, but nice for tablets if screen size changes
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

    // Update the time display for the newly selected city
    if (this.hasTimezones) {
      this.updateTimeDisplay();
    }
  }

  // Update the sliding bar under the current city
  // getBoundingClientRect() was a fun re-discovery!
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

  //TIMEZONE OPTION
  //Following methods are used to update the time display

  // Keeps the time display updated
  startTimeUpdates() {
    // Update time immediately
    this.updateTimeDisplay();

    // Update time every minute
    this.timeInterval = setInterval(() => {
      this.updateTimeDisplay();
    }, 60000); // 60000ms = 1 minute
  }

  updateTimeDisplay() {
    // Early return if we don't have timezone to express
    if (!this.hasTimezones) return;

    const activeItem = this.navItems.querySelector('.nav-item.active');
    if (!activeItem) {
      this.hideAllTimeDisplays();
      return;
    }

    try {
      const time = new Date().toLocaleTimeString('en-US', {
        timeZone: this.currentCity.timezone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      // Hide all time displays
      this.hideAllTimeDisplays();

      // Show only the active button's time display
      const activeTimeDisplay = activeItem.querySelector('.time-display');
      if (!activeTimeDisplay) {
        throw new Error('Time display element not found for active item');
      }
      activeTimeDisplay.textContent = time;

      // requestAnimationFrame ensures smooth visual updates by:
      // 1. Synchronizing with the browser's render cycle (typically 60fps)
      // 2. Preventing layout thrashing by batching DOM updates
      // 3. Ensuring the text content is updated before showing the element
      // This is especially important for time displays to prevent flickering
      // and ensure smooth transitions between updates
      requestAnimationFrame(() => {
        activeTimeDisplay.classList.remove('hidden');
        activeTimeDisplay.classList.add('visible');
      });
    } catch (error) {
      console.error('Error updating time:', error.message || error);
      this.hideAllTimeDisplays();
    }
  }

  // Helper method to hide all time displays
  hideAllTimeDisplays() {
    this.navItems.querySelectorAll('.time-display').forEach((display) => {
      display.classList.remove('visible');
      display.classList.add('hidden');
    });
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
    const wrapper = document.querySelectorAll('.city-navigation-component')[0];
    // Create and initialize the city navigation component passing in the wrapper and cities
    new CityNavigationComponent(wrapper, cities);

    // Fetch Cities with Timezones
    const responseWithTimezones = await fetch('navigation-timezone.json');
    const dataWithTimezones = await responseWithTimezones.json();
    // Create and initialize the city navigation component passing in the wrapper and cities
    const wrapperWithTimezones = document.querySelectorAll(
      '.city-navigation-component'
    )[1];
    new CityNavigationComponent(wrapperWithTimezones, dataWithTimezones.cities);
  } catch (error) {
    // error handling for testing purposes
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
