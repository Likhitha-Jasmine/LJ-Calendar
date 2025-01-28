const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const calendarDays = document.getElementById('calendar-days');
const monthYear = document.getElementById('month-year');
let currentDate = new Date();

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  calendarDays.innerHTML = '';
  monthYear.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

  // Add day names
  daysOfWeek.forEach(day => {
    calendarDays.innerHTML += `<div class="day-name">${day}</div>`;
  });

  // Add empty slots before first day
  for (let i = 0; i < firstDay; i++) {
    calendarDays.innerHTML += `<div class="day"></div>`;
  }

  // Add days
  for (let i = 1; i <= lastDate; i++) {
    const isToday =
      i === new Date().getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear();
    calendarDays.innerHTML += `<div class="day ${isToday ? 'today' : ''}">${i}</div>`;
  }
}

function prevMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
}

renderCalendar();
