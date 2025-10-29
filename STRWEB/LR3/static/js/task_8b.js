function Person(firstName, lastName)
{
    this._firstName = firstName;
    this._lastName = lastName
}

Person.prototype.getFirstName = function()
{
    return this._firstName;
}

Person.prototype.setFirstName = function(firstName)
{
    this._lastName = lastName;
}

Person.prototype.getLastName = function()
{
    return this._lastName;
}

Person.prototype.setLastName = function(lastName)
{
    this._lastName = lastName;
}

Person.prototype.toString = function()
{
    return `${this.getLastName()} ${this.getFirstName()}`;
}

function Pupil(firstName, lastName, grade, letter)
{
    Person.call(this, firstName, lastName);
    this._grade = grade;
    this._letter = letter;
}

Pupil.prototype = Object.create(Person.prototype);
Pupil.prototype.constructor = Pupil;

Pupil.prototype.getGrade = function()
{
    return this._grade;
}

Pupil.prototype.setGrade = function(grade)
{
    this._grade = grade;
}

Pupil.prototype.getLetter = function()
{
    return this._letter;
}

Pupil.prototype.setLetter = function(letter)
{
    this._letter = letter;
}

Pupil.prototype.toString = function()
{
    return `${this.getLastName()} ${this.getFirstName()} from ${this.getGrade() + this.getLetter()}`;
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
        if (pupilsMap.has(pupil.getLastName()))
        {
            pupilsMap.get(pupil.getLastName()).push(pupil);
            
        }
        else
        {
            pupilsMap.set(pupil.getLastName(), [pupil]);
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