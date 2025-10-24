document.addEventListener("DOMContentLoaded", function () 
{
    function themeUnicodeChar()
    {
        if (darkTheme)
        {
            themeSwitch.textContent = "🕯️";
        }
        else
        {
            themeSwitch.textContent = "💡";
        }
    }

    const themeSwitch = document.getElementById("themeSwitch");
    themeSwitch.addEventListener("click", function() 
    {
        darkTheme = !darkTheme;
        localStorage.setItem("darkTheme", darkTheme);
        themeUnicodeChar();
    });

    let darkTheme = localStorage.getItem("darkTheme");
    if (darkTheme === null)
    {
        darkTheme = true;
        localStorage.setItem("darkTheme", darkTheme);
    }
    else
    {
        darkTheme = darkTheme === "true";
    }
    
    themeUnicodeChar();
});