const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = document.querySelector(".uil-times");
const downloadImgBtn = document.querySelector(".uil-import");

// API key, paginations, searchTerm variables
// API anahtarı, sayfalandırmalar, arama Terimi değişkenleri

const apiKey = "lFHH04ykMhjrsak8jtPtVSs9ytcQciVvUOHPeLhSaew792TXxL8OoFrK";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;

const downloadImg = (imgURL) => {
  // Converting received image to blob, creating its download link, & downloading it
  // Alınan görüntüyü blob'a dönüştürme, indirme bağlantısını oluşturma ve indirme
  fetch(imgURL)
    .then((res) => res.blob())
    .then((file) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = new Date().getTime();
      a.click();
    })
    .catch(() => alert("Failed to download image!"));
};

const showLightbox = (name, img) => {
  // Showing lightbox and setting image source, name and button attribute
  // Işık kutusunu gösterme ve görüntü kaynağını ayarlama, ad
  lightBox.querySelector("img").src = img;
  lightBox.querySelector("span").innerText = name;
  downloadImgBtn.setAttribute("data-img", img);
  lightBox.classList.add("show");
  document.body.style.overflow = "hidden";
};

const hideLightbox = () => {
  // Hiding lightbox
  lightBox.classList.remove("show");
  document.body.style.overflow = "auto";
};

const generatedHTML = (images) => {
  // Making li of all fetched images and adding them to the existing image wrapper
  // Resim alanına fetch ile çekilen resimleri li tagı ile birlikte eklemeye yarar
  imagesWrapper.innerHTML += images
    .map(
      (img) =>
        `<li class="card" onclick="showLightbox('${img.photographer}' , '${img.src.large2x}')">
        <img src="${img.src.large2x}" alt="img">
        <div class="details">
                <div class="photographer">
                    <i class="uil uil-camera"></i>
                    <span>${img.photographer}</span>
                </div>
                <button onclick="downloadImg('${img.src.large2x}');event.stopPropagation();">
                    <i class="uil uil-import"></i>
                </button>
        </div>
    </li>`
    )
    .join("");
};

const getImages = (apiURL) => {
  // fetching images by API call with authorization header
  // Kullandığımız api key ile resimleri getirir
  loadMoreBtn.innerText = "Loading...";
  loadMoreBtn.classList.add("disabled");
  fetch(apiURL, {
    headers: { Authorization: apiKey },
  })
    .then((res) => res.json())
    .then((data) => {
      generatedHTML(data.photos);
      loadMoreBtn.innerText = "Daha Fazla Yükle";
      loadMoreBtn.classList.remove("disabled");
    })
    .catch(() => alert("Failed to load images!"));
};

const loadMoreImages = () => {
  currentPage++; // Increment currentPage by 1
  // If searchTerm has some value then call API with search term else call default API
  // searchterm'in bir değeri varsa, arama terimiyle API'yi arayın, aksi takdirde varsayılan API'yi arayın
  let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
  apiURL = searchTerm
    ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`
    : apiURL;
  getImages(apiURL);
};

const loadSearchImages = (e) => {
  // If the search input is empty, set the search term to null and return from here
  // Arama girişi boşsa, arama terimini null olarak ayarlayın ve buradan dönün
  if (e.target.value === "") return (searchTerm = null);
  // If pressed key is ENTER, update the current page, search term & call the getImages
  // ENTER tuşuna basılırsa, geçerli sayfayı, arama terimini güncelleyin ve Görüntüleri Al'ı arayın
  if (e.key === "Enter") {
    currentPage = 1;
    searchTerm = e.target.value;
    imagesWrapper.innerHTML = "";
    getImages(
      `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`
    );
  }
};

getImages(
  `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
);
loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click", hideLightbox);
downloadImgBtn.addEventListener("click", (e) =>
  downloadImg(e.target.dataset.img)
);
