let endDate = null;
let totalAddedMinutes = 0;

// Get Philippine Time
function getPHTime() {
    return new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" })
    );
}

// Update live current time
setInterval(() => {
    const now = getPHTime();
    document.getElementById("currentTime").innerText =
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    if (!endDate) {
        document.getElementById("endTime").innerText = "--:--";
    }
}, 1000);

function addMinutes(mins) {
    if (!endDate) {
        endDate = getPHTime();
    }

    endDate.setMinutes(endDate.getMinutes() + mins);
    totalAddedMinutes += mins;

    document.getElementById("endTime").innerText =
        endDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

    updateAddedTime();
}

function updateAddedTime() {
    const hours = Math.floor(totalAddedMinutes / 60);
    const minutes = totalAddedMinutes % 60;

    let text = "";
    if (hours > 0) text += `${hours} hr `;
    text += `${minutes} mins`;

    document.getElementById("addedTime").innerText = text;
}

function resetTime() {
    endDate = null;
    totalAddedMinutes = 0;
    document.getElementById("endTime").innerText = "--:--";
    document.getElementById("addedTime").innerText = "0 mins";
}

const trackerTab = document.getElementById("tracker-tab");
const calculatorTab = document.getElementById("calculator-tab");

const trackerContainer = document.getElementById("tracker-container");
const calculatorContainer = document.getElementById("calculator");

// Tracker tab click
trackerTab.addEventListener("click", () => {
    trackerTab.classList.add("active");
    calculatorTab.classList.remove("active");

    trackerContainer.classList.remove("d-none");
    calculatorContainer.classList.add("d-none");
});

// Calculator tab click
calculatorTab.addEventListener("click", () => {
    calculatorTab.classList.add("active");
    trackerTab.classList.remove("active");

    calculatorContainer.classList.remove("d-none");
    trackerContainer.classList.add("d-none");
});

// Initialize: show tracker, hide calculator
trackerContainer.classList.remove("d-none");
calculatorContainer.classList.add("d-none");


// ===== Get Philippine Time =====
function getPHTime() {
    return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" }));
}

// ===== Format time as HH:MM =====
function formatTime(date) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ===== Live time for calculator =====
const currentTimeCalcEl = document.getElementById("currentTimeCalc");
setInterval(() => {
    if (currentTimeCalcEl) {
        currentTimeCalcEl.textContent = formatTime(getPHTime());
    }
}, 1000);

// ===== Parse HH:MM AM/PM =====
function parseTime12(str) {
    // Expect format HH:MM AM/PM
    const match = str.trim().match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
    if (!match) return null;

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3].toUpperCase();

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return { hours, minutes };
}

// ===== Calculate Remaining Time =====
function calculateRemaining() {
    const usedTimeValue = document.getElementById("usedTimeInput").value.trim();
    const parsed = parseTime12(usedTimeValue);

    if (!parsed) {
        alert("Invalid time format! Use HH:MM AM/PM.");
        return;
    }

    const now = getPHTime();
    const target = new Date(now);
    target.setHours(parsed.hours, parsed.minutes, 0, 0);

    let remainingMs = target - now;

    const totalMinutes = Math.floor(remainingMs / 60000); // total minutes remaining
    document.getElementById("remainingTime").textContent = totalMinutes + " mins";
}


// ===== Reset Calculator =====
function resetCalculator() {
    document.getElementById("usedTimeInput").value = "";
    document.getElementById("remainingTime").textContent = "--:--";
}


const usedTimeInput = document.getElementById("usedTimeInput");

usedTimeInput.addEventListener("input", (e) => {
    let value = e.target.value.toUpperCase().replace(/[^0-9]/g, "");
    value = value.slice(0, 2) + ":" + value.slice(2);
    value = value + " PM";
    if (value.length > 8) value = value.slice(0, 8) + " PM";
    e.target.value = value;
});

function appendNumber(num) {
    let value = usedTimeInput.value.replace(/\D/g, "");

    if (value.length >= 4) return; // max 4 digits (HHMM)
    value += num;

    // Auto colon after 2 digits
    if (value.length > 2) {
        value = value.slice(0, 2) + ":" + value.slice(2);
    }

    // Always append PM
    value += " PM";

    usedTimeInput.value = value;
}

function backspace() {
    let value = usedTimeInput.value.replace(/\D/g, "");
    value = value.slice(0, -1);
    if (value.length > 2) {
        value = value.slice(0, 2) + ":" + value.slice(2);
    }
    usedTimeInput.value = value;
}

function clearInput() {
    usedTimeInput.value = "";
}