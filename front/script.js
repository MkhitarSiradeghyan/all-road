/* -------------------------
   CONSTANTS
-------------------------- */
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

const modal = document.getElementById("main_modal");
const modalBody = document.getElementById("modal_body");
const closeBtn = document.querySelector(".modal_close");

const navlinks = document.querySelectorAll(".header_navlink");
const burger_checkbox = document.getElementById("burger_checkbox");

const services = document.querySelectorAll(".services_item");
const docLinks = document.querySelectorAll(".legal_link");
const howItems = document.querySelectorAll(".how_item");

const currentYear = new Date().getFullYear();

/* -------------------------
   CUSTOM SELECT YEAR
-------------------------- */
// Create options via DocumentFragment
const optionsFragment = document.createDocumentFragment();
for (let y = currentYear; y >= 1950; y--) {
  const opt = document.createElement("div");
  opt.className = "option";
  opt.textContent = y;
  opt.dataset.value = y;
  optionsFragment.appendChild(opt);
}
optionsContainer.appendChild(optionsFragment);

// Toggle options visibility
selected.addEventListener("click", () => {
  optionsContainer.style.display = optionsContainer.style.display === "block" ? "none" : "block";
});

// Select option
optionsContainer.addEventListener("click", e => {
  const target = e.target;
  if (target.classList.contains("option")) {
    selected.textContent = target.textContent;
    selected.dataset.value = target.dataset.value;
    optionsContainer.style.display = "none";
    selected.classList.remove("error");
    const err = yearWrap.querySelector(".error_text");
    if (err) err.style.display = "none";
  }
});

// Click outside closes options
document.addEventListener("click", e => {
  if (!yearWrap.contains(e.target)) optionsContainer.style.display = "none";
});

/* -------------------------
   NAV LINKS
-------------------------- */
navlinks.forEach(navlink => navlink.addEventListener("click", () => burger_checkbox.checked = false));

/* -------------------------
   SLIDER
-------------------------- */
let index = 0;
let slidesPerView = getSlidesPerView();
let slideWidth = slides[0].getBoundingClientRect().width + 30;

function getSlidesPerView() {
  if (window.innerWidth <= 768) return 1;
  if (window.innerWidth <= 900) return 2;
  return 3;
}

function recalcSlideWidth() {
  slideWidth = slides[0].getBoundingClientRect().width + 30;
}

function updateSlider() {
  requestAnimationFrame(() => {
    track.style.transform = `translateX(-${index * slideWidth}px)`;
    updateDots();
  });
}

function createDots() {
  const pages = Math.ceil(slides.length / slidesPerView);
  const fragment = document.createDocumentFragment();
  dotsContainer.innerHTML = '';
  for (let i = 0; i < pages; i++) {
    const btn = document.createElement('button');
    btn.addEventListener('click', () => {
      index = i * slidesPerView;
      updateSlider();
    });
    if (i === 0) btn.classList.add('active');
    fragment.appendChild(btn);
  }
  dotsContainer.appendChild(fragment);
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

// Swipe
let startX = 0;
let isDragging = false;

track.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
  isDragging = true;
});

track.addEventListener('touchmove', e => {
  if (!isDragging) return;
  const diff = e.touches[0].clientX - startX;
  requestAnimationFrame(() => {
    track.style.transform = `translateX(${-index * slideWidth + diff}px)`;
  });
});

track.addEventListener('touchend', e => {
  if (!isDragging) return;
  isDragging = false;
  const diff = e.changedTouches[0].clientX - startX;
  if (diff > 50) {
    index -= slidesPerView;
    if (index < 0) index = slides.length - slidesPerView;
  } else if (diff < -50) {
    index += slidesPerView;
    if (index >= slides.length) index = 0;
  }
  updateSlider();
});

window.addEventListener('resize', () => {
  const oldSlidesPerView = slidesPerView;
  slidesPerView = getSlidesPerView();
  recalcSlideWidth();
  if (slidesPerView !== oldSlidesPerView) {
    createDots();
    updateSlider();
  }
});

// Initialize slider
createDots();
updateSlider();

/* -------------------------
   FORM SUBMIT
-------------------------- */
form.addEventListener("submit", async e => {
  e.preventDefault();
  let isValid = true;
  const requiredInputs = form.querySelectorAll("input[required]");

  requiredInputs.forEach(input => {
    const wrap = input.closest(".input_wrap") || input.closest(".radio_wrap");
    if (!wrap) return;
    let err = wrap.querySelector(".error_text");
    if (!input.value.trim()) {
      isValid = false;
      input.classList.add("error");
      if (!err) {
        err = document.createElement("div");
        err.className = "error_text";
        err.textContent = "This field is required";
        wrap.appendChild(err);
      }
      err.style.display = "block";
    } else {
      input.classList.remove("error");
      if (err) err.style.display = "none";
    }
  });

  if (!selected.dataset.value) {
    isValid = false;
    selected.classList.add("error");
    const err = yearWrap.querySelector(".error_text");
    if (err) err.style.display = "block";
  } else {
    selected.classList.remove("error");
    const err = yearWrap.querySelector(".error_text");
    if (err) err.style.display = "none";
  }

  if (!isValid) return;

  const data = {};
  new FormData(form).forEach((v, k) => data[k] = v);
  data.year = selected.dataset.value;

  try {
    const response = await fetch("https://all-road.onrender.com/api/submit/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (response.ok) {
      alert("Form submitted successfully");
      form.reset();
      selected.textContent = "Select Year";
      selected.dataset.value = "";
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

/* -------------------------
   FORM FLIP
-------------------------- */
flipFW.addEventListener("click", () => {
  formFront.style.transform = "rotateY(180deg)";
  formBack.style.transform = "rotateY(0deg)";
});
flipBW.addEventListener("click", () => {
  formFront.style.transform = "rotateY(0deg)";
  formBack.style.transform = "rotateY(-180deg)";
});

/* -------------------------
   MODALS
-------------------------- */
function closeModal() {
  modal.classList.remove("active");
  document.body.style.overflow = "";
}
closeBtn.addEventListener("click", closeModal);
modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

function fillModal(contentHTML) {
  modalBody.innerHTML = contentHTML;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

/* Services */
const serviceExtra = { /* ...твой объект ... */ };
services.forEach(item => {
  item.addEventListener("click", () => {
    const img = item.querySelector("img").src;
    const title = item.querySelector(".services_item_title").textContent;
    const text = item.querySelector(".services_item_text").textContent;
    const extra = serviceExtra[title] || "<p>More details coming soon.</p>";
    fillModal(`
      <div class="modal_service">
        <div class="modal_service_img"><img src="${img}" alt=""></div>
        <h2 class="modal_service_title">${title}</h2>
        <p class="modal_service_text">${text}</p>
        <div class="modal_service_extra">${extra}</div>
      </div>
    `);
  });
});

/* How Items */
const howExtra = { /* ...твой объект ... */ };
howItems.forEach(item => {
  item.addEventListener("click", () => {
    const img = item.querySelector("img").src;
    const title = item.querySelector(".how_item_title").textContent;
    const text = item.querySelector(".how_text").textContent;
    const extra = howExtra[title] || "";
    fillModal(`
      <div class="how_item_modal">
        <img src="${img}" alt="">
        <h3 class="how_item_title">${title}</h3>
        <p class="how_text">${text}</p>
        ${extra ? `<p class="how_extra">${extra}</p>` : ''}
      </div>
    `);
  });
});

/* Legal Docs */
docLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const type = link.dataset.type;
    let contentHTML = '';
    if (type === "terms") contentHTML = documentTemplate("Terms & Conditions", "By using...", "<ol><li>...</li></ol>");
    if (type === "privacy") contentHTML = documentTemplate("Privacy Policy", "We value your privacy...", "<ol><li>...</li></ol>");
    fillModal(contentHTML);
  });
});

// Template function for legal docs
function documentTemplate(title, text, content) {
  return `
    <div class="modal_document">
      <hgroup class="modal_legal_hgroup">
        <h1 class="modal_legal_title">Legal Terms</h1>
        <h2 class="common_title">${title}</h2>
      </hgroup>
      <p class="modal_legal_text">${text}</p>
      <div class="modal_document_content">${content}</div>
    </div>
  `;
}