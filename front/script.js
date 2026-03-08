const slider = document.querySelector('.slider');
const track = slider.querySelector('.slider__track');
const slides = [...slider.querySelectorAll('.slide')];
const prev = slider.querySelector('.slider__arrow--left');
const next = slider.querySelector('.slider__arrow--right');
const dotsContainer = slider.querySelector('.slider__dots');

const formFront = document.getElementById("form_front");
const formBack = document.getElementById("form_back");
const flipFW = document.getElementById("flip_fw");
const flipBW = document.getElementById("flip_bw");
const form = document.getElementById("form");

let index = 0;
let slidesPerView = getSlidesPerView();

function getSlidesPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
}

function updateSlider() {
    const slideWidth = slides[0].offsetWidth + 30;
    track.style.transform = `translateX(-${index * slideWidth}px)`;
    updateDots();
}

function createDots() {
    const pages = Math.ceil(slides.length / slidesPerView);
    dotsContainer.innerHTML = '';
    for (let i = 0; i < pages; i++) {
        const btn = document.createElement('button');
        btn.addEventListener('click', () => {
            index = i * slidesPerView;
            updateSlider();
        });
        if (i === 0) btn.classList.add('active');
        dotsContainer.append(btn);
    }
}

function updateDots() {
    const dots = dotsContainer.querySelectorAll('button');
    const page = Math.floor(index / slidesPerView);
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[page]) dots[page].classList.add('active');
}

next.addEventListener('click', () => {
    index += slidesPerView;
    if (index >= slides.length) index = 0;
    updateSlider();
});

prev.addEventListener('click', () => {
    index -= slidesPerView;
    if (index < 0) index = slides.length - slidesPerView;
    updateSlider();
});

window.addEventListener('resize', () => {
    const oldSlidesPerView = slidesPerView;
    slidesPerView = getSlidesPerView();
    if (slidesPerView !== oldSlidesPerView) {
        createDots();
        updateSlider();
    }
});

createDots();
updateSlider();

form.addEventListener("submit", async e => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => data[key] = value);
    try {
        const response = await fetch("http://localhost:8000/api/submit/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("Form submitted successfully");
            form.reset();
            formFront.style.transform = "rotateY(0deg)";
            formBack.style.transform = "rotateY(-180deg)";
        } else {
            alert("Error submitting form");
        }
    } catch (error) {
        console.error(error);
        alert("Network error");
    }
});

flipFW.addEventListener("click", () => {
    formFront.style.transform = "rotateY(180deg)";
    formBack.style.transform = "rotateY(0deg)";
});

flipBW.addEventListener("click", () => {
    formFront.style.transform = "rotateY(0deg)";
    formBack.style.transform = "rotateY(-180deg)";
});