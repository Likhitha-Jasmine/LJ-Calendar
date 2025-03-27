document.addEventListener('DOMContentLoaded', () => {
  // Splash screen animation: wait for the scale animation to finish (3s)
  // then add the fade-out class, and finally hide the splash screen.
  setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    splash.classList.add('fade-out');
    setTimeout(() => {
      splash.style.display = 'none';
    }, 1000); // fade-out duration
  }, 3000);

  /* --------------- State Management and View Switching --------------- */
  const views = document.querySelectorAll('.view');
  const defaultView = localStorage.getItem('defaultView') || 'view-month';

  // Function to show a view and hide others
  function switchView(viewId) {
    views.forEach(view => {
      view.style.display = (view.id === viewId) ? 'block' : 'none';
    });
    localStorage.setItem('defaultView', viewId);
  }

  // Initialize default view on page load
  switchView(defaultView);

  /* --------------- Sidebar Menu Functionality --------------- */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const sidebarMenu = document.getElementById('sidebar-menu');

  // Toggle sidebar display on hamburger button click
  hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent event from bubbling to document
    sidebarMenu.style.left = (sidebarMenu.style.left === '0px') ? '-260px' : '0px';
  });

  // Close sidebar if click happens outside of it
  document.addEventListener('click', (e) => {
    if (!sidebarMenu.contains(e.target) && e.target !== hamburgerBtn) {
      sidebarMenu.style.left = '-260px';
    }
  });

  // Add click events to each sidebar menu item
  document.querySelectorAll('#sidebar-menu li').forEach(item => {
    item.addEventListener('click', () => {
      const viewId = item.getAttribute('data-view');
      switchView(viewId);
      sidebarMenu.style.left = '-260px';
    });
  });

  /* --------------- Monthly Calendar Code --------------- */
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const calendarDays = document.getElementById('calendar-days');
  const monthYear = document.getElementById('month-year');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const yearSelector = document.getElementById('year-selector');
  const yearGrid = document.getElementById('year-grid');
  const yearHeader = document.getElementById('year-header');
  const prevYearBtn = document.getElementById('prev-year-btn');
  const nextYearBtn = document.getElementById('next-year-btn');
  const selectedYear = document.getElementById('selected-year');
  const totM = document.getElementById('tot-m'); // Month selection grid
  const monthOverlay = document.getElementById('month-overlay'); // Dimming overlay
  const currentYearElem = document.getElementById('current-year');
  const prevMonthYear = document.getElementById('prev-month-year');
  const nextMonthYear = document.getElementById('next-month-year');

  let currentDate = new Date();
  let currentStartYear = currentDate.getFullYear();
  const rangeLength = 16;

  function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    calendarDays.innerHTML = '';
    monthYear.innerHTML = `<span id="month-name">${currentDate.toLocaleString('default', { month: 'long' })}</span>
      <span id="year-name" class="year-selectable">${year}</span>`;

    // Render day names
    daysOfWeek.forEach(day => {
      calendarDays.innerHTML += `<div class="day-name">${day}</div>`;
    });

    // Empty cells before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.innerHTML += `<div class="day"></div>`;
    }

    // Render days of the month
    for (let i = 1; i <= lastDate; i++) {
      const currentDay = new Date(year, month, i).getDay();
      const isToday =
        i === new Date().getDate() &&
        month === new Date().getMonth() &&
        year === new Date().getFullYear();

      calendarDays.innerHTML += `<div class="day ${isToday ? 'today' : ''} ${currentDay === 0 ? 'sunday' : ''}">${i}</div>`;
    }

    // Attach click event to month name to open month selection with overlay
    document.getElementById('month-name').addEventListener('click', () => {
      totM.style.display = 'flex';
      monthOverlay.style.display = 'block';
      currentYearElem.textContent = currentDate.getFullYear();
      document.querySelectorAll('.month').forEach(monthElem => {
        const m = parseInt(monthElem.dataset.month);
        if (m === currentDate.getMonth()) {
          monthElem.classList.add('selected');
        } else {
          monthElem.classList.remove('selected');
        }
      });
    });

    // Attach click event to year name to open year selection
    document.getElementById('year-name').addEventListener('click', showYearSelector);
  }

  // Attach click event listeners to each month element (only once)
  document.querySelectorAll('.month').forEach(monthElem => {
    monthElem.addEventListener('click', (e) => {
      const selectedMonth = parseInt(e.target.dataset.month);
      currentDate.setMonth(selectedMonth);
      renderCalendar();
      totM.style.display = 'none';
      monthOverlay.style.display = 'none';
    });
  });

  // Clicking the overlay hides month selection
  monthOverlay.addEventListener('click', () => {
    totM.style.display = 'none';
    monthOverlay.style.display = 'none';
  });

  function showYearSelector() {
    yearGrid.innerHTML = '';
    const currentEndYear = currentStartYear + (rangeLength - 1);
    yearHeader.innerHTML = `${currentStartYear} - ${currentEndYear}`;

    for (let i = currentStartYear; i <= currentEndYear; i++) {
      const yearItem = document.createElement('div');
      yearItem.textContent = i;
      yearItem.classList.add('year');
      if (i === new Date().getFullYear()) {
        yearItem.classList.add('highlight');
      }
      yearItem.addEventListener('click', () => selectYear(i));
      yearGrid.appendChild(yearItem);
    }

    yearSelector.style.display = 'flex';
  }

  function selectYear(year) {
    currentDate.setFullYear(year);
    currentStartYear = year;
    yearSelector.style.display = 'none';
    renderCalendar();
  }

  prevYearBtn.addEventListener('click', () => {
    currentStartYear -= rangeLength;
    showYearSelector();
  });

  nextYearBtn.addEventListener('click', () => {
    currentStartYear += rangeLength;
    showYearSelector();
  });

  prevBtn.addEventListener("click", prevMonth);
  nextBtn.addEventListener("click", nextMonth);

  function prevMonth() {
    currentDate.setDate(1);
    let currentMonth = currentDate.getMonth();
    if (currentMonth === 0) {
      currentDate.setFullYear(currentDate.getFullYear() - 1);
      currentDate.setMonth(11);
    } else {
      currentDate.setMonth(currentMonth - 1);
    }
    renderCalendar();
  }

  function nextMonth() {
    currentDate.setDate(1);
    let currentMonth = currentDate.getMonth();
    if (currentMonth === 11) {
      currentDate.setFullYear(currentDate.getFullYear() + 1);
      currentDate.setMonth(0);
    } else {
      currentDate.setMonth(currentMonth + 1);
    }
    renderCalendar();
  }

  prevMonthYear.addEventListener('click', () => {
    currentDate.setFullYear(currentDate.getFullYear() - 1);
    currentYearElem.textContent = currentDate.getFullYear();
  });

  nextMonthYear.addEventListener('click', () => {
    currentDate.setFullYear(currentDate.getFullYear() + 1);
    currentYearElem.textContent = currentDate.getFullYear();
  });

  renderCalendar();

  /* --------------- Settings Functionality --------------- */
  const darkThemeToggle = document.getElementById('dark-theme-toggle');
  const brightnessInput = document.getElementById('brightness');
  const colorThemeButtons = document.querySelectorAll('.color-theme');

  if (localStorage.getItem('darkTheme') === 'true') {
    document.body.classList.add('dark-theme');
    darkThemeToggle.checked = true;
  }
  if (localStorage.getItem('brightness')) {
    brightnessInput.value = localStorage.getItem('brightness');
    document.body.style.filter = `brightness(${brightnessInput.value}%)`;
  }

  darkThemeToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('darkTheme', 'true');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('darkTheme', 'false');
    }
  });

  brightnessInput.addEventListener('input', (e) => {
    const brightnessValue = e.target.value;
    document.body.style.filter = `brightness(${brightnessValue}%)`;
    localStorage.setItem('brightness', brightnessValue);
  });

  colorThemeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.getAttribute('data-color');
      document.querySelector('.calendar').style.backgroundColor = color;
      localStorage.setItem('calendarColor', color);
    });
  });

  const savedColor = localStorage.getItem('calendarColor');
  if (savedColor) {
    document.querySelector('.calendar').style.backgroundColor = savedColor;
  }
});
