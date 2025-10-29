class Person
{
    constructor(firstName, lastName)
    {
        this._firstName = firstName;
        this._lastName = lastName;
    }

    get firstName()
    {
        return this._firstName;
    }

    set firstName(firstName)
    {
        this._firstName = firstName;
    }

    get lastName()
    {
        return this._lastName;
    }

    set lastName(lastName)
    {
        this._lastName = lastName;
    }

    toString()
    {
        return `${this.lastName} ${this.firstName}`;
    }
}

class Pupil extends Person
{
    constructor(firstName, lastName, grade, letter)
    {
        super(firstName, lastName);
        
        this._grade = grade;
        this._letter = letter;
    }

    get grade()
    {
        return this._grade;
    }

    set grade(grade)
    {
        this._grade = grade;
    }

    get letter()
    {
        return this._letter;
    }

    set letter(letter)
    {
        this._letter = letter;
    }

    toString()
    {
        return `${this.lastName} ${this.firstName} from ${this.grade + this.letter}`;
    }
}

let pupils = [];

function addPupil()
{
    let firstName = document.getElementById("firstNameField").value;
    let lastName = document.getElementById("lastNameField").value;
    let grade = document.getElementById("gradeField").value;
    let letter = document.getElementById("letterField").value;

    let pupil = new Pupil(firstName, lastName, grade, letter);
    pupils.push(pupil);

    displayPupils();
}

function displayPupils()
{
    pupilList.innerHTML = "";

    pupils.forEach((pupil) =>
    {
        let pupilElement = document.createElement("li");
        pupilElement.textContent = `${pupil}`;
        pupilList.appendChild(pupilElement)
    });

    if (pupilList.children.length === 0)
    {
        pupilList.textContent = "No pupils";
    }
}

function searchSameLastNames()
{
    matchesList.innerHTML = "";

    let pupilsMap = new Map();

    pupils.forEach((pupil) =>
    {
        if (pupilsMap.has(pupil.lastName))
        {
            pupilsMap.get(pupil.lastName).push(pupil);
            
        }
        else
        {
            pupilsMap.set(pupil.lastName, [pupil]);
        }
    });

    pupilsMap.forEach((pupilsArray, lastName) =>
    {
        if (pupilsArray.length > 1)
        {
            let listElement = document.createElement("li");
            let subList = document.createElement("ul");

            matchesList.appendChild(listElement);
            listElement.appendChild(subList);

            pupilsArray.forEach((pupil) => 
            {
                let pupilElement = document.createElement("li");
                pupilElement.textContent = `${pupil}`;

                subList.appendChild(pupilElement);
            })
        }
    });

    if (matchesList.children.length === 0)
    {
        matchesList.textContent = "No matches";
    }
}

const matchesList = document.getElementById("matchesList");
const pupilList = document.getElementById("pupilList");
displayPupils();
searchSameLastNames();