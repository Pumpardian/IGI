const leftParrot = document.getElementById("leftParrot");
const rightParrot = document.getElementById("rightParrot");
const text = document.getElementById("text");

window.addEventListener("scroll", () =>
{
    let value = scrollY;
    leftParrot.style.bottom = `-${value/2}px`;
    rightParrot.style.bottom = `-${value/2}px`;
    leftParrot.style.left = `-${value/2.2}px`;
    rightParrot.style.left = `${value/2.2}px`;
    text.style.bottom = `-${value}px`;
});