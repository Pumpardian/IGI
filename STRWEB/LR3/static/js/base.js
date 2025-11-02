document.addEventListener("DOMContentLoaded", function ()
{
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("nav-menu");

    hamburger.addEventListener("click", function (event)
    {
        navMenu.classList.add("active");
        event.stopPropagation();
    });

    document.addEventListener("click", function (event)
    {
        if (!navMenu.contains(event.target) && !hamburger.contains(event.target))
        {
            navMenu.classList.remove("active");
        }
    });

    const preloaderContainer = document.getElementById("preloader-container");
    setTimeout(() => preloaderContainer.classList.add("inactive"), 500);

    document.addEventListener('click', function(e)
    {
        if (e.target.closest('.message button'))
        {
            const messageDiv = e.target.closest('.message');
            if (messageDiv)
            {
                messageDiv.style.transition = 'opacity 0.3s ease';
                messageDiv.style.opacity = '0';
            
                setTimeout(() => messageDiv.remove(), 300);
            }
        }
    });
});