document.addEventListener("DOMContentLoaded", function()
{
    const contactListJsonUrl = '/contacts/json';
    const createContactJson = '/contacts/create-from-json';
    let contacts = [];
    let filteredContacts = [];
    let selectedContacts = [];
    let sort = { direction: "ascending", column: null };

    let currentPage = 1;
    const itemsPerPage = 3;

    //Table
    const contactTable = document.querySelector("#contact-table tbody");
    document.querySelectorAll("#contact-table th[data-column]").forEach((col) =>
    {
        col.addEventListener("click", () =>
        {
            const column = col.dataset.column;
            if (sort.column === column)
            {
                sort.direction = sort.direction === "ascending" ? "descending" : "ascending";
            }
            else
            {
                sort.direction = "ascending";
                sort.column = column;
            }

            sortContacts();
            updateTable();
        });
    });
    contactTable.addEventListener("change", (event) =>
    {
        const checkbox = event.target;
        if (checkbox.classList.contains("award-checkbox"))
        {
            const id = parseInt(checkbox.value);
            if (checkbox.checked)
            {
                if (!selectedContacts.includes(id))
                {
                    selectedContacts.push(id);
                }
            }
            else
            {
                if (selectedContacts.includes(id))
                {
                    selectedContacts = selectedContacts.filter((i) => i !== id);
                }
            }
        }
    });
    contactTable.addEventListener("click", (event) =>
    {
        const row = event.target.closest("tr");
        if (!row)
        {
            return;
        }

        const id = row.dataset.id;
        const contact = contacts.find((c) => c.id == id);
        if (contact)
        {
            contactDetails.classList.add("active");
            contactDetails.innerHTML = `
                <h3>Contact details</h3>
                <p><strong>Name:</strong> ${contact.name}</p>
                <p><strong>Description:</strong> ${contact.description}</p>
                <p><strong>Phone:</strong> ${contact.phone}</p>
                <p><strong>Email:</strong> ${contact.email}</p>
                <img src="/media/${contact.photo}" alt="Contact photo" width="200">
            `;
        }
    });

    //Filter
    const filterButton = document.getElementById("filter-button");
    filterButton.addEventListener("click", () =>
    {
        const filter = filterInput.value.toLowerCase().trim();
        if (filter)
        {
            filteredContacts = contacts.filter(
                (contact) =>
                    contact.name.toLowerCase().includes(filter) ||
                    contact.description.toLowerCase().includes(filter) ||
                    contact.phone.toLowerCase().includes(filter) ||
                    contact.email.toLowerCase().includes(filter)
            );
        }

        currentPage = 1;
        updateTable();
        updatePagination();
    })
    const filterInput = document.getElementById("filter-input");

    //Details
    const contactDetails = document.getElementById("contact-details");

    //Addition
    const addContactButton = document.getElementById("add-contact-button");
    const addContactModal = document.getElementById("add-contact-modal");
    const modalClose = document.getElementById("modal-close");
    addContactButton.addEventListener("click", () =>
    {
        addContactModal.classList.add("active");
    });
    modalClose.addEventListener("click", () =>
    {
        addContactModal.classList.remove("active");
        clearFormData();
    });
    window.addEventListener("click", (event) =>
    {
        if (event.target === addContactModal)
        {
            addContactModal.classList.remove("active");
            clearFormData();
        }
    });

    const addContactForm = document.getElementById("add-contact-form");
    const submitContactButton = document.getElementById("submit-contact-button");
    const formResult = document.getElementById("form-result");
    addContactForm.addEventListener("submit", async (event) =>
    {
        event.preventDefault();
        
        let contact;
        contact.name = nameInput.value.trim();
        contact.description = descriptionInput.value.trim();
        contact.photo = photoUrlInput.value.trim();
        contact.phone = phoneInput.value.trim();
        contact.email = emailInput.value.trim();

        try
        {
            const response = await fetch(createContactJson,
                {
                    method: "POST",
                    headers: 
                    {
                        "Content-Type": "application/json",
                        "X-CSRFToken": getCSRFToken()
                    },
                    body: JSON.stringify(contact)
                });
            
            if (response.ok)
            {
                const newContact = await response.json();
                contacts.push(newContact);
                loadContactList();
                formResult.textContent = "Contact added successfuly";
                formResult.style.color = "green";
                clearFormData();
                setTimeout(() => formResult.textContent = "", 2500);
            }
            else
            {
                const errorString = await response.json();
                console.error("Error:", errorString.Error);
                formResult.textContent = "Error while adding contact";
                formResult.style.color = "red";
            }
        }
        catch (e)
        {
            console.error("Error:", e);
            formResult.textContent = "Error while adding contact";
            formResult.style.color = "red";
        }
    });

    const nameInput = document.getElementById("name");
    nameInput.addEventListener("input", validateAddition);
    const descriptionInput = document.getElementById("description");
    descriptionInput.addEventListener("input", validateAddition);
    const emailInput = document.getElementById("email");
    emailInput.addEventListener("input", validateAddition);

    const photoUrlInput = document.getElementById("photo-url");
    const photoUrlError = document.getElementById("photo-url-error");
    photoUrlInput.addEventListener("input", () =>
    {
        const photoUrl = photoUrlInput.value;
        const regexPattern = /^(http(s)?:\/\/).+\.(html|php)$/i;

        if (regexPattern.test(photoUrl))
        {
            photoUrlError.value = "";
            photoUrlInput.style.backgroundColor = "";
            photoUrlInput.style.borderColor = "";
            photoUrlError.classList.remove("active")
        }
        else
        {
            photoUrlError.value = "Invalid url";
            photoUrlInput.style.backgroundColor = "red";
            photoUrlInput.style.borderColor = "red";
            photoUrlError.classList.add("active")
        }

        validateAddition();
    });

    const phoneInput = document.getElementById("phone");
    const phoneError = document.getElementById("phone-error");
    phoneInput.addEventListener("input", () =>
    {
        const phone = phoneInput.value;
        const regexPattern =
            /^((\+375|80)\s?\(?\d{2}\)?|8\s?\(?\d{3}\)?)\s?\d{3}[- ]?\d{2}[- ]?\d{2}$/;

        if (regexPattern.test(phone))
        {
            phoneError.value = "";
            phoneInput.style.backgroundColor = "";
            phoneInput.style.borderColor = "";
            phoneError.classList.remove("active");
        }
        else
        {
            phoneError.value = "Invalid url";
            phoneInput.style.backgroundColor = "red";
            phoneInput.style.borderColor = "red";
            phoneError.classList.add("active")
        }

        validateAddition();
    });

    //Award
    const awardButton = document.getElementById("award-button");
    const awardText = document.getElementById("award-text");
    awardButton.addEventListener("click", () =>
    {
        if (selectedContacts.length === 0)
        {
            awardText.classList.add("active");
            awardText.textContent = "No contacts selected to award";
            return;
        }

        const selectedNames = contacts
        .filter((contact) => selectedContacts.includes(contact.id))
        .map((contact) => contact.name);

        const namesString = selectedNames.join(", ");
        awardText.classList.add("active");
        awardText.textContent = `Congratulations to: ${namesString} with award grant!`;

        setTimeout(() => awardText.classList.remove("active"), 10000);
    });

    //Pagination
    const currentPageSpan = document.getElementById("current-page");
    const totalPagesSpan = document.getElementById("total-pages");
    
    const prevPageButton = document.getElementById("prev-page");
    prevPageButton.addEventListener("click", () =>
    {
        if (currentPage > 1)
        {
            --currentPage;
            updateTable();
            updatePagination();
        }
    });
    const nextPageButton = document.getElementById("next-page");
    nextPageButton.addEventListener("click", () =>
    {
        const pageCount = Math.ceil(filteredContacts.length / itemsPerPage);
        if (currentPage < pageCount)
        {
            ++currentPage;
            updateTable();
            updatePagination();
        }
    });

    async function loadContactList() 
    {
        try
        {
            const contactsJson = await fetch(contactListJsonUrl);
            if (!contactsJson.ok)
            {
                throw new Error(`Error while loading contacts: ${contactsJson.status} - ${contactsJson.statusText}`);
            }
            
            contacts = await contactsJson.json();
            filteredContacts = contacts.slice();
            updateTable();
            updatePagination();

            console.log("Contact list loaded successfuly");
        }
        catch (e)
        {
            console.error(e);
            contactTable.textContent = "Data load failed";
        }
    };

    function updateTable()
    {
        contactTable.innerHTML = "";

        const startItem = (currentPage - 1) * itemsPerPage;
        const endItem = startItem + itemsPerPage;
        
        const pageContacts = filteredContacts.slice(startItem, endItem);
        if (pageContacts.length === 0)
        {
            contactTable.textContent = "No contacts";
            return;
        }
        pageContacts.forEach((contact) =>
        {
            const row = document.createElement("tr");
            row.dataset.id = contact.id;

            const isSelected = selectedContacts.includes(contact.id);

            row.innerHTML = `
                <td>${contact.name}</td>
                <td><img src="/media/${contact.photo}" alt="Contact photo"></td>
                <td>${contact.description}</td>
                <td>${contact.phone}</td>
                <td>${contact.email}</td>
                <td><input type="checkbox" class="award-checkbox" value="${contact.id}" ${isSelected ? "checked" : ""}></td>
            `;

            contactTable.appendChild(row);
        });

        contactDetails.innerHTML = "No contact selected";
    }

    function updatePagination()
    {
        const pageCount = Math.ceil(filteredContacts.length / itemsPerPage);
        totalPagesSpan.textContent = pageCount;
        currentPageSpan.textContent = currentPage;

        if (currentPage === 1)
        {
            prevPageButton.disabled = true;
            prevPageButton.classList.add("inactive-btn");
        }
        else
        {
            prevPageButton.disabled = false;
            prevPageButton.classList.remove("inactive-btn");
        }

        if (pageCount === 0 || currentPage === pageCount)
        {
            nextPageButton.disabled = true;
            nextPageButton.classList.add("inactive-btn");
        }
        else
        {
            nextPageButton.disabled = false;
            nextPageButton.classList.remove("inactive-btn");
        }
    }

    function sortContacts()
    {
        column = sort.column;
        direction = sort.direction;
        if (!sort.column)
        {
            return;
        }

        filteredContacts.sort((a, b) =>
        {
            let valueA = a[column];
            let valueB = b[column];

            if (typeof valueA === "string")
            {
                valueA = valueA.toLowerCase();
                valueB = valueB.toLowerCase();
            }

            if (valueA > valueB)
            {
                return direction === "ascending" ? 1 : -1;
            }
            else if (valueA < valueB)
            {
                return direction === "ascending" ? -1 : 1;
            }
            return 0;
        });

        updateSortVisualsForColumns();
    }

    function updateSortVisualsForColumns()
    {
        document.querySelectorAll("#contact-table th[data-column]").forEach((col) =>
        {
            const direction = col.querySelector(".sort-direction");
            const column = col.dataset.column;
            if (column === sort.column)
            {
                direction.textContent = sort.direction === "ascending" ? " ▲" : " ▼";
            }
            else
            {
                direction.textContent = "";
            }
        });
    }

    function validateAddition()
    {
        isValidPhotoUrl = photoUrlError.classList.contains("active")
                        && photoUrlInput.value.trim() !== "";
        isValidPhone = phoneError.classList.contains("active")
                        && phoneInput.value.trim() !== "";
        isNameValid = nameInput.value.trim() !== "";
        isDescriptionValid = descriptionInput.value.trim() !== "";
        isEmailValid = emailInput.value.trim() !== "";

        if (!isValidPhotoUrl
             || !isValidPhone
             || !isNameValid 
             || !isDescriptionValid
             || !isEmailValid)
        {
            submitContactButton.disabled = true;
            submitEmployeeBtn.classList.remove("inactive-btn");
        }
        else
        {
            submitContactButton.disabled = false;
            submitEmployeeBtn.classList.add("inactive-btn");
        }
    }

    function getCSRFToken()
    {
        const token = document.cookie.match("(^|;)\\s*csrftoken\\s*=\\s*([^;]+)");
        return token ? token.pop() : "";
    }

    function clearFormData()
    {
        addContactForm.reset();
        submitContactButton.disabled = true;
        formResult.textContent = "";
        photoUrlInput.style.borderColor = "";
        photoUrlInput.style.backgroundColor = "";
        phoneInput.style.borderColor = "";
        phoneInput.style.backgroundColor = "";
    }

    contactDetails.innerHTML = "No contact selected";
    submitContactButton.disabled = true;
    submitContactButton.classList.add("inactive-btn");
    loadContactList();
});