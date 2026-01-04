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