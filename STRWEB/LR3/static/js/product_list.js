document.addEventListener("DOMContentLoaded", function()
{
    const productListJsonUrl = '/product-list/json';
    const isAuthenticated = window.isAuthenticated;
    const isStaff = window.isStaff;

    let products = [];

    let currentPage = 1;
    let pageCount = 1;
    const itemsPerPage = +(localStorage.getItem("pageSize") ?? (parseInt(localStorage.getItem("pageSize")) || 3));

    const pageSizeForm = document.getElementById("pageSizeForm");
    pageSizeForm.addEventListener("submit", () =>
    {
        const pageSize = document.getElementById("pageSize").value;
        localStorage.setItem("pageSize", pageSize);
        itemsPerPage = parseInt(pageSize);

        currentPage = 1;
        displayProducts();
        updatePagination();
        goToCatalog();
    });

    const productContainer = document.getElementById("product-list");
    const prevButton = document.getElementById("prev-page");
    prevButton.addEventListener("click", () =>
    {
        if (currentPage > 1) 
        {
            --currentPage;
            displayProducts();
            updatePagination();
            goToCatalog();
        }
    });
    const nextButton = document.getElementById("next-page");
    nextButton.addEventListener("click", () =>
    {
        if (currentPage < pageCount)
        {
            ++currentPage;
            displayProducts();
            updatePagination();
            goToCatalog();
        }
    });

    const paginationNumbers = document.getElementById("page-numbers");

    async function loadProductList()
    {
        try
        {
            const productsJson = await fetch(productListJsonUrl);
            if (!productsJson.ok)
            {
                throw new Error(`Error while loading products: ${productsJson.status} - ${productsJson.statusText}`);
            }

            products = await productsJson.json();

            console.log("Product list loaded successfuly");
        }
        catch (e)
        {
            console.error(e);
        }

        pageCount = Math.ceil(products.length / itemsPerPage);
        displayProducts();
        updatePagination();
    }

    function displayProducts()
    {
        productContainer.innerHTML = "";

        const startItem = (currentPage - 1) * itemsPerPage;
        const endItem = startItem + itemsPerPage;

        const pageProducts = products.slice(startItem, endItem);
        if (pageProducts.length === 0)
        {
            productContainer.textContent = "No products";
        }

        pageProducts.forEach((product) =>
        {
            const cardWrapper = document.createElement("div");
            cardWrapper.classList.add("card-wrapper");

            const productCard = document.createElement("a");
            productCard.classList.add("product-card");
            productCard.href = `/products/${product.id}`;

            let photo;
            if (product.photo)
            {
                photo = document.createElement("img");
                photo.classList.add("product-image");
                photo.src = `/media/${product.photo}`;
                photo.alt = `${product.title} photo`;
            }
            else
            {
                const noImage = document.createElement("div");
                noImage.textContent = "Photo is missing";
                noImage.classList.add("no-image");
                
                photo = noImage;
            }

            const productTitle = document.createElement("h3");
            productTitle.classList.add("product-title");
            productTitle.textContent = product.title;

            const productDescription = document.createElement("p");
            productDescription.classList.add("product-description");
            productDescription.textContent = product.description;

            const productPrice = document.createElement("p");
            productPrice.classList.add("product-price");
            productPrice.textContent = `Price: ${product.price}`;

            productCard.appendChild(photo);
            productCard.appendChild(productTitle);
            productCard.appendChild(productDescription);
            productCard.appendChild(productPrice);

            cardWrapper.appendChild(productCard);

            if (isAuthenticated)
            {
                const container = document.createElement("div");
                container.classList.add("container");

                const detailsButton = document.createElement("a");
                detailsButton.href = `/products/${product.id}`;
                detailsButton.classList.add("btn", "btn-primary");
                detailsButton.textContent = "Details";

                container.appendChild(detailsButton);
                
                if (isStaff)
                {
                    const editButton = document.createElement("a");
                    editButton.href = `/products/${product.id}/edit`;
                    editButton.classList.add("btn", "btn-secondary");
                    editButton.textContent = "Edit";

                    const deleteButton = document.createElement("a");
                    deleteButton.href = `/products/${product.id}/delete`;
                    deleteButton.classList.add("btn", "btn-danger");
                    deleteButton.textContent = "Delete";

                    container.appendChild(editButton);
                    container.appendChild(deleteButton);
                }

                productCard.appendChild(container);
            }

            productContainer.appendChild(cardWrapper);
        });

        updatePaginationButtons();
        updateVolume();
    }

    function updateVolume()
    {
        const cards = document.querySelectorAll(".card-wrapper");

        cards.forEach(
        card_w =>
        {
        
        const card = card_w.querySelector(".product-card");  

        card_w.addEventListener('mousemove', event=>
        {
            const [x, y] = [event.offsetX, event.offsetY];
            const rect = card_w.getBoundingClientRect();
            const [width, height] = [rect.width, rect.height];
            const middleX = width / 2;
            const middleY = height / 2;
            const offsetX = ((x - middleX) / middleX) * 15;
            const offsetY = ((y - middleY) / middleY) * 15;
            const offX = 10 + ((x - middleX) / middleX) * 5;
            const offY = 10 - ((y - middleY) / middleY) * 4;
            card.style.setProperty("--rotateX", 1 * offsetX + "deg");
            card.style.setProperty("--rotateY", -1 * offsetY + "deg");
            card.style.setProperty("--posx", offX + "%");
            card.style.setProperty("--posy", offY + "%");
        });
        card_w.addEventListener('mouseleave', eve=>
        {
            
            card.style.animation = 'reset-card 1s ease';
            card.addEventListener("animationend", e=>
            {
            card.style.animation = 'unset';
            card.style.setProperty("--rotateX", "0deg");
            card.style.setProperty("--rotateY", "0deg");
            card.style.setProperty("--posx", "50%");
            card.style.setProperty("--posy", "50%");
            },
            {
            once: true
            });
        });
        });
    }

    function updatePagination()
    {
        paginationNumbers.innerHTML = "";

        for (let i = 1; i <= pageCount; ++i)
        {
            const pageButton = document.createElement("button");
            pageButton.textContent = i;
            pageButton.classList.add("btn");
            if (i === currentPage)
            {
                pageButton.classList.add("active");
            }
            pageButton.addEventListener("click", () =>
            {
                currentPage = i;
                displayProducts();
                updatePagination();
                goToCatalog();
            });

            paginationNumbers.appendChild(pageButton);
        }
    }

    function updatePaginationButtons()
    {
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === pageCount;
    }

    function goToCatalog()
    {
        window.scrollTo(
            {
                top: productContainer.offsetTop - 200,
                behavior: "smooth"
            }
        )
    }

    document.getElementById("pageSize").value = itemsPerPage;
    loadProductList();
});