async function dislpayBatteryStatus()
{
    const messages = document.getElementById("messages");
    const div = document.createElement("div");
    div.classList.add("message");

    const dismiss = document.createElement("button");
    dismiss.type = "button";
    dismiss.innerHTML = "<span>&times;</span>";

    const batteryManager = await navigator.getBattery();
    const message = document.createElement("pre");
    message.textContent = `is charging: ${batteryManager.charging}\ncharging time (sec): ${batteryManager.chargingTime}\ndischarging time (sec): ${batteryManager.dischargingTime}\ncharge level: ${batteryManager.level}`;
    
    div.appendChild(message);
    div.appendChild(dismiss);
    messages.appendChild(div);
}

dislpayBatteryStatus();