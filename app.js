const imagesArea = document.querySelector(".images");
const gallery = document.querySelector(".gallery");
const galleryHeader = document.querySelector(".gallery-header");
const searchBtn = document.getElementById("search-btn");
const sliderBtn = document.getElementById("create-slider");
const sliderContainer = document.getElementById("sliders");

// selected image
let sliders = [];

// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = "15674931-a9d714b6e9d654524df198e00&q";

// show images
const showImages = (images) => {
  imagesArea.style.display = "block";
  gallery.innerHTML = "";
  if (images == 0) {
    gallery.innerHTML = `
  <h2 class="text-danger">Sorry! No image Found.</h2>
  `;
  } else {
    //// show gallery title
    galleryHeader.style.display = "flex";
    images.forEach((image) => {
      let div = document.createElement("div");
      div.className = "col-lg-3 col-md-4 col-xs-6 img-item mb-2";
      div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
      gallery.appendChild(div);
    });
  }
  toggleSpinner();
};

const getImages = (query) => {
  let searchInput = document.getElementById("search").value;
  //// search of empty value (Bonus mark part)
  if (searchInput == "") {
    gallery.innerHTML = `
  <h2 class="text-danger" style="margin-left: 265px;">Please write something in the search box.</h2>
  `;
  } else {
    toggleSpinner();
    fetch(
      `https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`
    )
      .then((response) => response.json())
      .then((data) => {
        showImages(data.hits);
      });
  }
};

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.toggle("added");

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    //// alert('Hey, Already added !')
    sliders = sliders.filter((slider) => slider !== img);
  }
};
var timer;
const createSlider = () => {
  //// check slider image length
  if (sliders.length < 2) {
    alert("Select minimum two images.");
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = "";
  const prevNext = document.createElement("div");
  prevNext.className =
    "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext);
  document.querySelector(".main").style.display = "block";
  // hide image area
  imagesArea.style.display = "none";
  let duration = document.getElementById("duration").value || 1000;
  if (duration > 0) {
    sliders.forEach((slide) => {
      let item = document.createElement("div");
      item.className = "slider-item";
      item.innerHTML = `<img class="w-100"
      src="${slide}"
      alt="">`;
      sliderContainer.appendChild(item);
    });
    changeSlide(0);
    timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
    }, duration);
    // alert('Congratulations. Slider is  Complete.');
  } else {
    duration = 1000;
    let negativeDuration = document.getElementById("sliders");
    negativeDuration.innerHTML = `
    <p class="text-danger">Sorry! Duration can't be negative value. It Sets the default value.</p>
    `;
    sliders.forEach((slide) => {
      let item = document.createElement("div");
      item.className = "slider-item";
      item.innerHTML = `<img class="w-100"
      src="${slide}"
      alt="">`;
      sliderContainer.appendChild(item);
    });
    changeSlide(0);
    timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
    }, duration);
  }
};

// change slider index
const changeItem = (index) => {
  changeSlide((slideIndex += index));
};

// change slide item
const changeSlide = (index) => {
  const items = document.querySelectorAll(".slider-item");
  if (index < 0) {
    slideIndex = items.length - 1;
    index = slideIndex;
  }

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach((item) => {
    item.style.display = "none";
  });

  items[index].style.display = "block";
};

searchBtn.addEventListener("click", function () {
  searchingImages();
});

const searchingImages = () => {
  document.querySelector(".main").style.display = "none";
  clearInterval(timer);
  const search = document.getElementById("search");
  getImages(search.value);
  sliders.length = 0;
};

sliderBtn.addEventListener("click", function () {
  createSlider();
});

// search when enter key clicked
search.addEventListener("keypress", function (event) {
  if (event.key == "Enter") {
    searchBtn.click();
  }
});

// create slider when enter key clicked  (Bonus mark part)
duration.addEventListener("keypress", function (event) {
  if (event.key == "Enter") {
    sliderBtn.click();
  }
});
// toggle spinner add function  (Bonus mark part)
const toggleSpinner = (show) => {
  const spinner = document.getElementById("spinner");
  spinner.classList.toggle("d-none");
};

// dismiss button  (Bonus mark part)
document.getElementById("backButton").addEventListener("click", function () {
  searchingImages();
});
