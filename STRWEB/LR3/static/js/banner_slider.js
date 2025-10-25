class BannerSlider
{
    constructor(bannerSliderSelector)
    {
        this.currentBanner = 0;
        this.banners = document.querySelectorAll(`${bannerSliderSelector} .banner`);
        this.counterElement = document.querySelector(`${bannerSliderSelector} .banner-counter`);
        this.paginationContainer = document.querySelector(`${bannerSliderSelector} .pagination`);
        this.bannersCount = this.banners.length;
        
        this.bannerSliderSelector = bannerSliderSelector
        this.element = document.querySelector(this.bannerSliderSelector);
        this.slideInterval = null;

        this.initialize();
    }

    initialize()
    {
        this.loop = this.element.getAttribute("loop");
        this.loop = this.loop === "True";
        this.navs = this.element.getAttribute("navs");
        this.navs = this.navs === "True";
        this.pags = this.element.getAttribute("pags");
        this.pags = this.pags === "True";
        this.auto = this.element.getAttribute("auto");
        this.auto = this.auto === "True";
        this.stopMouseHover = this.element.getAttribute("stopMouseHover");
        this.stopMouseHover = this.stopMouseHover === "True";
        this.delay = this.element.getAttribute("delay");
        this.delay = parseInt(this.delay, 10) || 5;

        if (this.pags)
        {
            this.createPaginationDots();
        }
        this.showBanner(this.currentBanner);

        if (this.navs)
        {
            document.querySelector(`${this.bannerSliderSelector} .prev-area`).addEventListener("click", () => this.previousBanner());
            document.querySelector(`${this.bannerSliderSelector} .next-area`).addEventListener("click", () => this.nextBanner());
        }
        else
        {
            const prevArea = document.querySelector(`${this.bannerSliderSelector} .prev-area`);
            const nextArea = document.querySelector(`${this.bannerSliderSelector} .next-area`);
            if (prevArea)
            {
                prevArea.remove();
            }
            if (nextArea)
            {
                nextArea.remove();
            }
        }

        this.banners.forEach((banner) => 
        {
            banner.addEventListener("click", () =>
            {
                const url = slide.getAttribute("data-url");
                if (url)
                {
                    window.open(url, "_blank");
                }
            })
        });

        if (this.auto)
        {
            this.startAutoSliding();
        }

        if (this.auto && this.stopMouseHover)
        {
            this.element.addEventListener("mouseenter", () =>
            {
                this.stopAutoSliding();
            });

            this.element.addEventListener("mouseleave", () =>
            {
                if (!this.loop && (this.currentBanner !== this.bannersCount - 1))
                {
                    this.startAutoSliding(); 
                }
                else if (this.loop)
                {
                    this.startAutoSliding();
                }
            });
        }
    }

    updateCounter()
    {
        this.counterElement.textContent = `${this.currentBanner + 1} / ${this.bannersCount}`;
    }

    updateNavs()
    {
        let nextElement = document.querySelector(`${this.bannerSliderSelector} .next-area`);
        let prevElement = document.querySelector(`${this.bannerSliderSelector} .prev-area`);
        if (!this.loop)
        {
            if (this.currentBanner === this.bannersCount - 1)
            {
                if (this.auto)
                {
                    this.stopAutoSliding();
                }

                if (nextElement)
                {
                    nextElement.style.display = "none";
                }
            }
            else
            {
                if (this.auto)
                {
                    this.startAutoSliding();
                }

                if (nextElement)
                {
                    nextElement.style.display = "flex";
                }
            }

            if (this.currentBanner === 0)
            {
                if (prevElement)
                {
                    prevElement.style.display = "none";
                }
            }
            else
            {
                if (prevElement)
                {
                    prevElement.style.display = "flex";
                }
            }
        }
    }

    nextBanner()
    {
        this.currentBanner = (this.currentBanner + 1) % this.bannersCount;
        this.updateNavs();
        this.showBanner(this.currentBanner);
    }

    previousBanner()
    {
        this.currentBanner = (this.currentBanner - 1 + this.bannersCount) % this.bannersCount;
        this.updateNavs();
        this.showBanner(this.currentBanner);
    }

    setBanner(index)
    {
        this.currentBanner = index;
        this.showBanner(this.currentBanner);

        if (this.auto && (this.currentBanner === this.bannersCount - 1))
        {
            this.stopAutoSliding();
        }
        else
        {
            this.startAutoSliding();
        }
    }

    showBanner(index)
    {
        //Update display style for each banner,
        //so the banner with index will display,
        //while the others wont

        this.banners.forEach((banner, i) =>
        {
            banner.style.display = i === index ? "block" : "none";
        });

        this.updateCounter();
        if (this.pags)
        {
            this.updateActiveDot();
        }
    }

    stopAutoSliding()
    {
        if (this.slideInterval)
        {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }

    startAutoSliding()
    {
        this.stopAutoSliding();
        this.slideInterval = setInterval(() => this.nextBanner(), this.delay * 1000);
    }

    createPaginationDots()
    {
        this.paginationContainer.innerHTML = "";

        for (let i = 0; i < this.bannersCount; ++i)
        {
            const dot = document.createElement("div");
            dot.classList.add("pagination-dot");
            if (i === this.currentBanner)
            {
                dot.classList.add("active");
            }

            dot.addEventListener("click", () => this.setBanner(i));
            this.paginationContainer.appendChild(dot);
        }
    }

    updateActiveDot()
    {
        const dots = this.paginationContainer.querySelectorAll(".pagination-dot");

        dots.forEach((dot, i) => 
        {
            dot.classList.toggle("active", i === this.currentBanner);
        });
    }
}

document.addEventListener("DOMContentLoaded", () => 
{
    window.bannerSlider = new BannerSlider(".bannerSlider");
});