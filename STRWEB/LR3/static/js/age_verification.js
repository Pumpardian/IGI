document.addEventListener("DOMContentLoaded", function ()
{
    if (!localStorage.getItem("ageVerified"))
    {
        function verifyUserAge()
        {
            let birthdayInput = prompt("Please enter your birthday date (Format MM.DD.YYYY):");

            if (birthdayInput)
            {
                let numbers = birthdayInput.split(".");
                if (numbers.length === 3)
                {
                    let month = parseInt(numbers[0], 10) - 1;
                    let day = parseInt(numbers[1], 10);
                    let year = parseInt(numbers[2], 10);

                    let birthday = new Date(year, month, day);
                    let today = new Date();

                    if (birthday.getMonth() !== month ||
                        birthday.getDate() !== day ||
                        birthday.getFullYear() !== year)
                    {
                        alert("Invalid date format, should be MM.DD.YYYY, try again...");
                        verifyUserAge();

                        return;
                    }

                    let userAge = today.getFullYear() - birthday.getFullYear();
                    let monthOffset =  today.getMonth() - birthday.getMonth();
                    let dayOffset = today.getDate() - birthday.getDate();

                    if (monthOffset < 0 || monthOffset === 0 && dayOffset < 0)
                    {
                        --userAge;
                    }

                    if (userAge >= 18)
                    {
                        let weekday = birthday.toLocaleDateString("en-US", { weekday: "long" });
                        alert(`Your age is ${userAge}. Your birthday weekday is ${weekday}`);
                    }
                    else
                    {
                        alert("To use this site you need parents permission");
                    }

                    localStorage.setItem("ageVerified", "true");
                }
                else
                {
                    alert("Invalid date format, should be MM.DD.YYYY, try again...");
                    verifyUserAge();
                }
            }
            else
            {
                alert("To continue using our site we need to verify your age");
                verifyUserAge();
            }
        }

        verifyUserAge();
    }
});