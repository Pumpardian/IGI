const clearButton = document.getElementById("clear-storage");

document.addEventListener("DOMContentLoaded", function ()
{
    if (clearButton)
    {
        clearButton.addEventListener("click", function ()
        {
            localStorage.clear();
            location.reload();
        });
    }

    createRotateAnimation();
    createPulseAnimation();
});

function createRotateAnimation()
{            
    const keyframes =
    [
        { transform: 'rotate(0deg)', easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)' },
        { transform: 'rotate(180deg)', easing: 'cubic-bezier(0.1, 0.1, 0.1, 1)' },
        { transform: 'rotate(360deg)', easing: 'cubic-bezier(0.1, 0.1, 0.1, 1)' }
    ];
    
    const animationOptions =
    {
        duration: 3000,
        iterations: Infinity,
        direction: 'normal'
    };
    
    clearButton.animate(keyframes, animationOptions);
}

function createPulseAnimation()
{            
    const keyframes =
    [
        { boxShadow: '0 0 0 0 rgba(255, 0, 128, 0.7)' },
        { boxShadow: '0 0 0 15px rgba(255, 0, 128, 0)' },
        { boxShadow: '0 0 0 0 rgba(255, 0, 128, 0)' }
    ];
    
    const animationOptions =
    {
        duration: 3000,
        iterations: Infinity,
    };
    
    clearButton.animate(keyframes, animationOptions);
}