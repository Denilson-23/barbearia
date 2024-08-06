document.addEventListener('DOMContentLoaded', function() {
    const daysContainer = document.getElementById('days-container');
    const monthYear = document.getElementById('month-year');
    const selectedDate = document.getElementById('selected-date');
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-date-time');
    const modalClientInfo = document.getElementById('modal-client-info');
    const span = document.getElementsByClassName('close')[0];
    const confirmModal = document.getElementById('confirm-modal');
    const confirmMessage = document.getElementById('confirm-message');
    const confirmYes = document.getElementById('confirm-yes');
    const confirmNo = document.getElementById('confirm-no');
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    const today = date.getDate();
    let appointments = {}; // Placeholder for appointments
    let longPressTimer; // Timer for long press detection
    let longPressCallback; // Store the callback to execute on confirmation

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

            dayElement.addEventListener('click', (e) => {
                if (!dayElement.classList.contains('disabled')) {
                    showTimeslots(i);
                }
            });
            dayElement.addEventListener('touchstart', (e) => {
                if (!dayElement.classList.contains('disabled')) {
                    showTimeslots(i);
                }
            });
            addLongPressEvent(dayElement, () => {
                if (dayElement.classList.contains('disabled')) {
                    showConfirmModal('Você deseja habilitar essa data?', () => {
                        dayElement.classList.remove('disabled');
                    });
                } else {
                    showConfirmModal('Você deseja anular essa data?', () => {
                        dayElement.classList.add('disabled');
                    });
                }
            });
            daysContainer.appendChild(dayElement);
        }
    }

    function addLongPressEvent(element, callback) {
        let startX, startY;
        const threshold = 10; // Allowable movement threshold for long press

        element.addEventListener('mousedown', startLongPress);
        element.addEventListener('mouseup', cancelLongPress);
        element.addEventListener('mouseleave', cancelLongPress);
        element.addEventListener('touchstart', startLongPress);
        element.addEventListener('touchend', cancelLongPress);
        element.addEventListener('touchmove', cancelLongPress);

        function startLongPress(e) {
            e.preventDefault();
            if (e.type === 'touchstart') {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            }
            longPressTimer = setTimeout(() => {
                longPressCallback = callback;
                longPressCallback();
            }, 1000);
        }

        function cancelLongPress(e) {
            if (e.type === 'touchmove') {
                const moveX = e.touches[0].clientX;
                const moveY = e.touches[0].clientY;
                if (Math.abs(moveX - startX) > threshold || Math.abs(moveY - startY) > threshold) {
                    clearTimeout(longPressTimer);
                }
            } else {
                clearTimeout(longPressTimer);
            }
        }
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
                timeslot.addEventListener('click', (e) => openModal(day, hour, appointments[`${year}-${month + 1}-${day}-${hour}`]));
                timeslot.addEventListener('touchstart', (e) => openModal(day, hour, appointments[`${year}-${month + 1}-${day}-${hour}`]));
            } else {
                timeslot.addEventListener('click', (e) => openModal(day, hour));
                timeslot.addEventListener('touchstart', (e) => openModal(day, hour));
                addLongPressEvent(timeslot, () => {
                    if (timeslot.classList.contains('disabled')) {
                        showConfirmModal('Você deseja habilitar esse horário?', () => {
                            timeslot.classList.remove('disabled');
                        });
                    } else {
                        showConfirmModal('Você deseja anular esse horário?', () => {
                            timeslot.classList.add('disabled');
                        });
                    }
                });
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

    function showConfirmModal(message, callback) {
        confirmMessage.textContent = message;
        confirmModal.style.display = 'block';
        confirmYes.onclick = () => {
            callback();
            confirmModal.style.display = 'none';
        };
        confirmNo.onclick = () => {
            confirmModal.style.display = 'none';
        };
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

