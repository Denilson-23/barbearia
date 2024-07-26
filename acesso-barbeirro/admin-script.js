document.addEventListener('DOMContentLoaded', function () {
    const daysContainer = document.getElementById('days-container');
    const monthYear = document.getElementById('month-year');
    const selectedDate = document.getElementById('selected-date');
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-date-time');
    const modalClientInfo = document.getElementById('modal-client-info');
    const span = document.getElementsByClassName('close')[0];
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');

    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    const today = date.getDate();

    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    const appointments = [
        { date: '27/07/2024', time: '10:00 - 11:00', name: 'João Silva', phone: '123456789', email: 'joao@example.com' },
        { date: '27/07/2024', time: '11:00 - 12:00', name: 'Maria Oliveira', phone: '987654321', email: 'maria@example.com' },
        { date: `${today}/07/2024`, time: '10:00 - 11:00', name: 'Teste Cliente', phone: '123456789', email: 'teste@example.com' },
    ];

    function renderCalendar() {
        daysContainer.innerHTML = '';
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
            if (i === today && month === date.getMonth() && year === date.getFullYear()) {
                dayElement.classList.add('today');
            }

            dayElement.onclick = () => showTimeslots(i);
            daysContainer.appendChild(dayElement);
        }
    }

    function showTimeslots(day) {
        const timeslotsContainer = document.getElementById('timeslots-container');
        const timeslots = document.getElementById('timeslots');
        timeslots.innerHTML = '';

        selectedDate.textContent = `Dia selecionado: ${day} de ${monthNames[month]}`;
        for (let hour = 7; hour <= 18; hour++) {
            const timeslot = document.createElement('div');
            timeslot.className = 'timeslot';
            timeslot.textContent = `${hour}:00 - ${hour + 1}:00`;

            const appointment = appointments.find(app => app.date === `${day}/${String(month + 1).padStart(2, '0')}/${year}` && app.time === `${hour}:00 - ${hour + 1}:00`);
            if (appointment) {
                timeslot.classList.add('occupied');
                timeslot.onclick = () => openModal(day, hour, appointment);
            }

            timeslots.appendChild(timeslot);
        }
    }

    function openModal(day, hour, appointment) {
        modal.style.display = "block";
        modalContent.textContent = `Data: ${day}/${String(month + 1).padStart(2, '0')}/${year}, Hora: ${hour}:00 - ${hour + 1}:00`;
        modalClientInfo.innerHTML = `
            <p>Nome: ${appointment.name}</p>
            <p>Telefone: ${appointment.phone}</p>
            <p>Email: ${appointment.email}</p>
        `;
    }


    span.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }

    prevMonthBtn.onclick = function () {
        if (month === 0) {
            month = 11;
            year--;
        } else {
            month--;
        }
        renderCalendar();
    }

    nextMonthBtn.onclick = function () {
        if (month === 11) {
            month = 0;
            year++;
        } else {
            month++;
        }
        renderCalendar();
    }

    renderCalendar();
    showTimeslots(today);
});
