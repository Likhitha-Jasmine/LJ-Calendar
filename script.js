document.addEventListener('DOMContentLoaded', () => {
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
  const currentYear = document.getElementById('current-year');
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
    // (Reattach here because month name is re-rendered)
    document.getElementById('month-name').addEventListener('click', () => {
      totM.style.display = 'flex';
      monthOverlay.style.display = 'block';
      // Update the header of month selection with the current year
      currentYear.textContent = currentDate.getFullYear();
      // Highlight the month corresponding to the current calendar month
      document.querySelectorAll('.month').forEach(monthElem => {
        const m = parseInt(monthElem.dataset.month);
        if (m === currentDate.getMonth()) {
          monthElem.classList.add('selected');
        } else {
          monthElem.classList.remove('selected');
        }
      });
    });

    // Attach click events to year name to open year selection
    document.getElementById('year-name').addEventListener('click', showYearSelector);
  }

  // Attach click event listeners to each month only once
  document.querySelectorAll('.month').forEach(monthElem => {
    monthElem.addEventListener('click', (e) => {
      const selectedMonth = parseInt(e.target.dataset.month);
      currentDate.setMonth(selectedMonth);
      renderCalendar();
      totM.style.display = 'none';
      monthOverlay.style.display = 'none';
    });
  });

  // Clicking the overlay hides the month selection
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
    currentYear.textContent = currentDate.getFullYear();
  });

  nextMonthYear.addEventListener('click', () => {
    currentDate.setFullYear(currentDate.getFullYear() + 1);
    currentYear.textContent = currentDate.getFullYear();
  });

  renderCalendar();
});
