document.addEventListener("DOMContentLoaded", function ()
{
    const clearButton = document.getElementById("clear-storage");

    if (clearButton)
    {
        clearButton.addEventListener("click", function ()
        {
            localStorage.clear();
            location.reload();
        });
    }
})