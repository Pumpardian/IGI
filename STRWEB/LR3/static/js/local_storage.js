document.addEventListener("DOMContentLoaded", function ()
{
    const clearButton = document.getElementById("clearStorage");

    if (clearButton)
    {
        clearButton.addEventListener("click", function ()
        {
            localStorage.clear();
            location.reload();
        });
    }
})