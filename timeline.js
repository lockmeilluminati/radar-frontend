const dateRow = document.getElementById('date-row');
const hourRow = document.getElementById('hour-row');
const minuteRow = document.getElementById('minute-row');

let anchorDate = new Date(); 
let selectedDate = new Date(anchorDate);
let selectedHour = selectedDate.getHours();
let selectedMinute = 0; 

function generateInfiniteDates() {
    dateRow.innerHTML = '';
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = -365; i <= 365; i++) {
        let tDate = new Date(anchorDate);
        tDate.setDate(tDate.getDate() + i);
        const div = document.createElement('div');
        div.className = `time-block ${i === 0 ? 'active' : ''}`;
        div.innerHTML = `<span class="day-label">${days[tDate.getDay()]}</span><span class="date-label">${months[tDate.getMonth()]} ${String(tDate.getDate()).padStart(2, '0')}</span>`;
        div.onclick = () => {
            document.querySelectorAll('#date-row .time-block').forEach(el => el.classList.remove('active'));
            div.classList.add('active');
            selectedDate = tDate;
            triggerUplink();
        };
        dateRow.appendChild(div);
    }
    setTimeout(() => dateRow.querySelector('.active')?.scrollIntoView({ behavior: 'smooth', inline: 'center' }), 100);
}

function generateHours() {
    hourRow.innerHTML = '';
    for (let h = 0; h < 24; h++) {
        const div = document.createElement('div');
        div.className = `time-block ${h === selectedHour ? 'active' : ''}`;
        const ampm = h >= 12 ? 'PM' : 'AM';
        div.innerHTML = `<span class="hour-label">${h % 12 === 0 ? 12 : h % 12} <small>${ampm}</small></span>`;
        div.onclick = () => {
            document.querySelectorAll('#hour-row .time-block').forEach(el => el.classList.remove('active'));
            div.classList.add('active');
            selectedHour = h;
            triggerUplink();
        };
        hourRow.appendChild(div);
    }
    setTimeout(() => hourRow.querySelector('.active')?.scrollIntoView({ behavior: 'smooth', inline: 'center' }), 100);
}

function generateMinutes() {
    minuteRow.innerHTML = '';
    for (let m = 0; m < 60; m += 5) {
        const div = document.createElement('div');
        div.className = `time-block ${m === selectedMinute ? 'active' : ''}`;
        div.innerHTML = `<span class="hour-label">:${String(m).padStart(2, '0')} <small>MIN</small></span>`;
        div.onclick = () => {
            document.querySelectorAll('#minute-row .time-block').forEach(el => el.classList.remove('active'));
            div.classList.add('active');
            selectedMinute = m;
            triggerUplink();
        };
        minuteRow.appendChild(div);
    }
    setTimeout(() => minuteRow.querySelector('.active')?.scrollIntoView({ behavior: 'smooth', inline: 'center' }), 100);
}

function triggerUplink() {
    const yyyy = selectedDate.getFullYear();
    const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const dd = String(selectedDate.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    
    const formattedHour = String(selectedHour).padStart(2, '0');
    const formattedMinute = String(selectedMinute).padStart(2, '0');
    
    window.dispatchEvent(new CustomEvent('tactical-time-shift', { 
        detail: { date: formattedDate, hour: formattedHour, minute: formattedMinute } 
    }));
}

generateInfiniteDates();
generateHours();
generateMinutes();

// Fire immediately on load
triggerUplink();
