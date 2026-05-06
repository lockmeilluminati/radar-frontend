// timeline.js
const dateRow = document.getElementById('date-row');
const hourRow = document.getElementById('hour-row');

// The Perpetual Clock
let anchorDate = new Date(); 
let selectedDate = new Date(anchorDate);
let selectedHour = selectedDate.getHours();

function generateInfiniteDates() {
    dateRow.innerHTML = '';
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Rolling Year Generator (-365 days to +365 days)
    for (let i = -365; i <= 365; i++) {
        let tDate = new Date(anchorDate);
        tDate.setDate(tDate.getDate() + i);
        
        const dayStr = days[tDate.getDay()];
        const dateStr = `${months[tDate.getMonth()]} ${String(tDate.getDate()).padStart(2, '0')}`;
        
        const div = document.createElement('div');
        div.className = `time-block ${i === 0 ? 'active' : ''}`;
        
        div.innerHTML = `
            <span class="day-label">${dayStr}</span>
            <span class="date-label">${dateStr}</span>
        `;
        
        div.onclick = () => {
            document.querySelectorAll('#date-row .time-block').forEach(el => el.classList.remove('active'));
            div.classList.add('active');
            selectedDate = tDate;
            triggerUplink();
        };
        dateRow.appendChild(div);
    }

    setTimeout(() => {
        const activeDateEl = dateRow.querySelector('.active');
        if (activeDateEl) {
            activeDateEl.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }
    }, 100);
}

function generateHours() {
    hourRow.innerHTML = '';
    for (let h = 0; h < 24; h++) {
        const div = document.createElement('div');
        div.className = `time-block ${h === selectedHour ? 'active' : ''}`;
        
        const displayHour = h % 12 === 0 ? 12 : h % 12;
        const ampm = h >= 12 ? 'PM' : 'AM';
        
        div.innerHTML = `<span class="hour-label">${displayHour} <small>${ampm}</small></span>`;
        
        div.onclick = () => {
            document.querySelectorAll('#hour-row .time-block').forEach(el => el.classList.remove('active'));
            div.classList.add('active');
            selectedHour = h;
            triggerUplink();
        };
        hourRow.appendChild(div);
    }
    
    setTimeout(() => {
        const activeHourEl = hourRow.querySelector('.active');
        if (activeHourEl) {
            activeHourEl.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }
    }, 100);
}

function triggerUplink() {
    const formattedDate = selectedDate.toISOString().split('T')[0];
    const formattedHour = String(selectedHour).padStart(2, '0') + "00";
    
    // Broadcast target to index.html
    window.dispatchEvent(new CustomEvent('tactical-time-shift', { 
        detail: { date: formattedDate, hour: formattedHour } 
    }));
}

// Boot the Engine
generateInfiniteDates();
generateHours();
