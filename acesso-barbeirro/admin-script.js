document.addEventListener('DOMContentLoaded', function() {
    const daysContainer = document.getElementById('days-container');
    const monthYear = document.getElementById('month-year');
    const selectedDate = document.getElementById('selected-date');
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-date-time');
    const modalClientInfo = document.getElementById('modal-client-info');
    const span = document.getElementsByClassName('close')[0];
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    const today = date.getDate();
    let appointments = {}; // Placeholder for appointments

    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    
    function renderCalendar() {
        daysContainer.innerHTML = '';
        monthYear.textContent = `${monthNames[month]} ${year}`;
        
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const monthDays = new Date(year, month + 1, 0).getDate();
        const todayDate = new Date();
        
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
            if (i === today && month === todayDate.getMonth() && year === todayDate.getFullYear()) {
                dayElement.classList.add('today');
            } else if (currentDate < todayDate && month === todayDate.getMonth() && year === todayDate.getFullYear()) {
                dayElement.classList.add('past');
            }
            
            dayElement.onclick = () => showTimeslots(i);
            dayElement.addEventListener('mousedown', (e) => handleLongPress(e, dayElement));
            dayElement.addEventListener('mouseup', clearLongPress);
            dayElement.addEventListener('mouseleave', clearLongPress);
            daysContainer.appendChild(dayElement);
        }
    }

    function handleLongPress(e, element) {
        e.preventDefault();
        element.longPressTimeout = setTimeout(() => {
            if (confirm('Você deseja anular essa data?')) {
                element.classList.toggle('disabled');
            }
        }, 1000);
    }

    function clearLongPress(e) {
        clearTimeout(e.currentTarget.longPressTimeout);
    }

    function showTimeslots(day) {
        const timeslotsContainer = document.getElementById('timeslots-container');
        const timeslots = document.getElementById('timeslots');
        timeslots.innerHTML = '';

        selectedDate.textContent = `Dia selecionado: ${day}/${String(month + 1).padStart(2, '0')}/${year}`;
        for (let hour = 7; hour <= 18; hour++) {
            const timeslot = document.createElement('div');
            timeslot.className = 'timeslot';
            timeslot.textContent = `${hour}:00 - ${hour + 1}:00`;
            
            if (appointments[`${year}-${month + 1}-${day}-${hour}`]) {
                timeslot.classList.add('occupied');
                timeslot.onclick = () => openModal(day, hour, appointments[`${year}-${month + 1}-${day}-${hour}`]);
            } else {
                timeslot.onclick = () => openModal(day, hour);
                timeslot.addEventListener('mousedown', (e) => handleLongPress(e, timeslot));
                timeslot.addEventListener('mouseup', clearLongPress);
                timeslot.addEventListener('mouseleave', clearLongPress);
            }
            timeslots.appendChild(timeslot);
        }
    }

    function openModal(day, hour, appointment) {
        modal.style.display = "block";
        modalContent.textContent = `Data: ${day}/${String(month + 1).padStart(2, '0')}/${year}, Hora: ${hour}:00 - ${hour + 1}:00`;
        if (appointment) {
            modalClientInfo.textContent = `Nome: ${appointment.name}\nTelefone: ${appointment.phone}\nEmail: ${appointment.email}`;
        } else {
            modalClientInfo.textContent = '';
        }
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }

    document.getElementById('prev-month').onclick = function() {
        if (month === 0) {
            month = 11;
            year--;
        } else {
            month--;
        }
        renderCalendar();
    }

    document.getElementById('next-month').onclick = function() {
        month++;
        if (month > 11) {
            month = 0;
            year++;
        }
        renderCalendar();
    }

    renderCalendar();
});
