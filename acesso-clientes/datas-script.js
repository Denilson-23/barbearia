document.addEventListener('DOMContentLoaded', function() {
    const daysContainer = document.getElementById('days-container');
    const monthYear = document.getElementById('month-year');
    const selectedDate = document.getElementById('selected-date');
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-date-time');
    const span = document.getElementsByClassName('close')[0];
    const form = document.getElementById('user-info-form');
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const today = date.getDate();

    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    monthYear.textContent = `${monthNames[month]} ${year}`;

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const monthDays = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyElement = document.createElement('div');
        emptyElement.className = 'day empty';
        daysContainer.appendChild(emptyElement);
    }

    for (let i = 1; i <= monthDays; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.textContent = i;

        const currentDate = new Date(year, month, i);
        if (i === today) {
            dayElement.classList.add('today');
            dayElement.onclick = () => showTimeslots(i);
        } else if (currentDate < date) {
            dayElement.classList.add('past');
        } else {
            dayElement.onclick = () => showTimeslots(i);
        }
        daysContainer.appendChild(dayElement);
    }

    function showTimeslots(day) {
const timeslotsContainer = document.getElementById('timeslots-container');
const timeslots = document.getElementById('timeslots');
timeslots.innerHTML = '';

selectedDate.textContent = `Dia selecionado: ${day} de ${monthNames[month]}`;
for (let hour = 7; hour <= 18; hour++) { // Aqui você define os horários
const timeslot = document.createElement('div');
timeslot.className = 'timeslot';
timeslot.textContent = `${hour}:00 - ${hour + 1}:00`;
timeslot.onclick = () => openModal(day, hour);
timeslots.appendChild(timeslot);
}
}

    function openModal(day, hour) {
        modal.style.display = "block";
        modalContent.textContent = `Dia: ${day} de ${monthNames[month]}, Horário: ${hour}:00 - ${hour + 1}:00`;
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }

    form.onsubmit = function(event) {
        event.preventDefault();
        alert('Agendamento confirmado!');
        modal.style.display = "none";
    }
});