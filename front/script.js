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

const yearWrap = document.getElementById("year_select_wrap");
const selected = document.getElementById("selected_year");
const optionsContainer = document.getElementById("year_options");

const currentYear = new Date().getFullYear();

for (let y = currentYear; y >= 1950; y--) {
  const opt = document.createElement("div");
  opt.className = "option";
  opt.textContent = y;
  opt.dataset.value = y;
  optionsContainer.appendChild(opt);
}

selected.addEventListener("click", () => {
  optionsContainer.style.display = optionsContainer.style.display === "block" ? "none" : "block";
});

optionsContainer.addEventListener("click", e => {
  if (e.target.classList.contains("option")) {
    selected.textContent = e.target.textContent;
    selected.dataset.value = e.target.dataset.value;
    optionsContainer.style.display = "none";
    selected.classList.remove("error");
    yearWrap.querySelector(".error_text").style.display = "none";
  }
});

document.addEventListener("click", e => {
  if (!yearWrap.contains(e.target)) {
    optionsContainer.style.display = "none";
  }
});

const navlinks = document.querySelectorAll(".header_navlink")
const burger_checkbox = document.getElementById("burger_checkbox")
navlinks.forEach(navlink => {

    navlink.addEventListener("click", () => {
        burger_checkbox.checked = false
    })
})

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
let startX = 0;
let isDragging = false;

track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    isDragging = true;
});

track.addEventListener('touchmove', e => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;

    track.style.transform = `translateX(${-index * (slides[0].offsetWidth + 30) + diff}px)`;
});

track.addEventListener('touchend', e => {
    if (!isDragging) return;
    isDragging = false;
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;

    if (diff > 50) {
        index -= slidesPerView;
        if (index < 0) index = slides.length - slidesPerView;
    } else if (diff < -50) {
        index += slidesPerView;
        if (index >= slides.length) index = 0;
    }

    updateSlider();
});
createDots();
updateSlider();

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let isValid = true;

  const requiredInputs = form.querySelectorAll("input[required]");
  requiredInputs.forEach(input => {
    const wrap = input.closest(".input_wrap") || input.closest(".radio_wrap");
    const oldError = wrap.querySelector(".error_text");
    if (oldError) oldError.remove();
    input.classList.remove("error", "valid");

    if (!input.value.trim()) {
      isValid = false;
      input.classList.add("error");
      const err = document.createElement("div");
      err.className = "error_text";
      err.textContent = "This field is required";
      wrap.appendChild(err);
    } else {
      input.classList.add("valid");
    }
  });

  // кастомный select
  if (!selected.dataset.value) {
    isValid = false;
    selected.classList.remove("valid");
    selected.classList.add("error");
    yearWrap.querySelector(".error_text").style.display = "block";
  } else {
    selected.classList.remove("error");
    selected.classList.add("valid");
    yearWrap.querySelector(".error_text").style.display = "none";
  }

  if (!isValid) return;

  const formData = new FormData(form);
  formData.append("year", selected.dataset.value);

  const data = {};
  formData.forEach((v,k) => data[k] = v);

  try {
    const response = await fetch("https://all-road.onrender.com/api/submit/", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(data)
    });

    if (response.ok) {
      alert("Form submitted successfully");
      form.reset();
      selected.textContent = "Select Year";
      selected.dataset.value = "";
      selected.classList.remove("valid", "error");
      requiredInputs.forEach(input => input.classList.remove("valid", "error"));
      formFront.style.transform = "rotateY(0deg)";
      formBack.style.transform = "rotateY(-180deg)";
    } else {
      alert("Error submitting form");
    }

  } catch (err) {
    console.error(err);
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

const modal = document.getElementById("main_modal")
const modalBody = document.getElementById("modal_body")
const closeBtn = document.querySelector(".modal_close")

/* -------------------------
    EXTRA CONTENT
-------------------------- */

const serviceExtra = {
    "Car Hauling": `
        <ul>
            <li>Door to door delivery</li>
            <li>Licensed carriers</li>
            <li>Insurance included</li>
        </ul>
    `,
    "Trailer Towing": `
        <ul>
            <li>All trailer types supported</li>
            <li>Fast scheduling</li>
            <li>Nationwide coverage</li>
        </ul>
    `,
    "Motorcycle Shipping": `
        <ul>
            <li>Soft tie straps</li>
            <li>Safe loading</li>
            <li>Experienced drivers</li>
        </ul>
    `,
    "Enclosed Shipping": `
        <ul>
            <li>Fully enclosed trailers</li>
            <li>Weather protection</li>
            <li>Premium transport</li>
        </ul>
    `,
    "Heavy Equipment": `
        <ul>
            <li>Industrial equipment transport</li>
            <li>Specialized carriers</li>
            <li>Oversized cargo support</li>
        </ul>
    `,
    "Boat Shipping": `
        <ul>
            <li>Boat and yacht transport</li>
            <li>Secure loading</li>
            <li>Nationwide delivery</li>
        </ul>
    `
}
const howExtra = {
    "01. Get a Quote": "Receive a detailed price estimate quickly and accurately.",
    "02. Book": "Reserve your shipment with flexible scheduling options.",
    "03. We Schedule": "We arrange the transport according to your preferences.",
    "04. Pickup": "Your vehicle is collected safely and on time.",
    "05. Delivery": "Delivery at your chosen location, hassle-free."
}
/* -------------------------
   TEMPLATES
-------------------------- */

function serviceTemplate(img, title, text, extra) {

    return `
        <div class="modal_service">

            <div class="modal_service_img">
                <img src="${img}" alt="">
            </div>

            <h2 class="modal_service_title">${title}</h2>

            <p class="modal_service_text">${text}</p>

            <div class="modal_service_extra">
                ${extra}
            </div>

        </div>
    `
}

function documentTemplate(title, text,  content) {

    return `
        <div class="modal_document">
            <hgroup class="modal_legal_hgroup">
            <h1 class="modal_legal_title">Legal Terms</h1>
            <h2 class="common_title">${title}</h2>
            </hgroup>
            <p class="modal_legal_text">${text}</p>
            <div class="modal_document_content">
                ${content}
            </div>

        </div>
    `
}
function howTemplate(img, title, text, extra) {
    return `
        <div class="how_item_modal">
                <img src="${img}" alt="">
            <h3 class="how_item_title">${title}</h3>
            <p class="how_text">${text}</p>
            ${extra ? `<p class="how_extra">${extra}</p>` : ''}
        </div>
    `
}

/* -------------------------
   SERVICE CARDS
-------------------------- */

const services = document.querySelectorAll(".services_item")

services.forEach(item => {

    item.addEventListener("click", () => {

        const img = item.querySelector("img").src
        const title = item.querySelector(".services_item_title").textContent
        const text = item.querySelector(".services_item_text").textContent

        const extra = serviceExtra[title] || "<p>More details coming soon.</p>"

        modalBody.innerHTML = serviceTemplate(img, title, text, extra)

        modal.classList.add("active")

        document.body.style.overflow = "hidden"

    })

})

/* -------------------------
   TERMS / PRIVACY
-------------------------- */

const docLinks = document.querySelectorAll(".legal_link")

docLinks.forEach(link => {

    link.addEventListener("click", e => {

        e.preventDefault()

        const type = link.dataset.type

        if (type === "terms") {

            modalBody.innerHTML = documentTemplate(
                '<span class="highlighted">Terms</span> & Conditions',
                "By using our services, you agree to follow these terms and conditions for access.",
                `
                <ol>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </li>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </li>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </li>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </li>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </li>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </li>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </li>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </li>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </li>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </li>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </li>
                </ol>
                `
            )

        }

        if (type === "privacy") {

            modalBody.innerHTML = documentTemplate(
                'Privacy <span class="highlighted">Policy</span>',
                "All Road Carriers (“ARC”) values your privacy. To provide accurate pricing and quality service, we collect certain information about you and may share it with necessary partners. This Privacy Policy explains what we collect, why we collect it, and how we protect it. By using our website, you agree to the current version of this Policy. For more details about how our site and services operate, please review our Terms & Conditions",
                `
                <ol>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </li>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </li>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </li>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </li>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </li>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </li>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </li>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </li>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </li>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </li>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </li>
                </ol>
                
                `
            )

        }

        modal.classList.add("active")

        document.body.style.overflow = "hidden"

    })

})

/* -------------------------
   HOW ITEMS MODAL
------------------------- */
const howItems = document.querySelectorAll(".how_item")

howItems.forEach(item => {
    item.addEventListener("click", () => {
        const img = item.querySelector("img").src
        const title = item.querySelector(".how_item_title").textContent
        const text = item.querySelector(".how_text").textContent
        const extra = howExtra[title] || ""

        modalBody.innerHTML = howTemplate(img, title, text, extra)
        modal.classList.add("active")
        document.body.style.overflow = "hidden"
    })
})
/* -------------------------
   CLOSE MODAL
-------------------------- */

function closeModal() {

    modal.classList.remove("active")

    document.body.style.overflow = ""

}

closeBtn.addEventListener("click", closeModal)

modal.addEventListener("click", e => {

    if (e.target === modal) {

        closeModal()

    }

})

/* -------------------------
   ESC KEY CLOSE
-------------------------- */

document.addEventListener("keydown", e => {

    if (e.key === "Escape") {

        closeModal()

    }

})