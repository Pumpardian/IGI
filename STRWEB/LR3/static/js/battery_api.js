async function dislpayBatteryStatus()
{
    const messages = document.getElementById("messages");
    const div = document.createElement("div");
    div.classList.add("message", "alert");

    const dismiss = document.createElement("button");
    dismiss.type = "button";
    dismiss.setAttribute("data-dismiss", "alert");
    dismiss.innerHTML = "<span>&times;</span>";

    const batteryManager = await navigator.getBattery();

    div.textContent = `is charging: ${batteryManager.charging}; charging time (sec): ${batteryManager.chargingTime}; discharging time (sec): ${batteryManager.dischargingTime}; charge level: ${batteryManager.level};`;
    div.appendChild(dismiss);
    messages.appendChild(div);
}

dislpayBatteryStatus();