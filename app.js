const options = {
  headers: {
    "X-RapidAPI-Key": "d22e31df04mshf6629822592dcc7p117d62jsna4c6fe88ce03",
  },
};

//Przyciski do zmiany obrazu aplikacji
const phoneVersionBtn = document.getElementById("phoneVersionBtn");
const computerVersionBtn = document.getElementById("computerVersionBtn");
const appImage = document.getElementById("appImage");

// Funkcja do obsługi wiadomości WebSocket dla określonej pary walutowej
function handleWebSocketMessage(event, priceElement, loadCallback) {
  const data = JSON.parse(event.data);
  const price = parseFloat(data.p).toFixed(2);
  priceElement.innerHTML = "$" + price;
  if (loadCallback) loadCallback(price); // Przekazujemy cenę do funkcji zwrotnej
}

// Funkcja do tworzenia WebSocket dla określonej pary walutowej
function createWebSocket(url, priceElement, loadCallback) {
  const socket = new WebSocket(url);
  socket.onmessage = function (event) {
    handleWebSocketMessage(event, priceElement, loadCallback);
  };
}

// Funkcja do pobrania z danych określonej zmiany ceny
function getChangeValue(data, objectNumber, writeChange) {
  const valueToChange = data.data.coins[objectNumber].change;
  writeChange.innerHTML = valueToChange + "%";
}

const fetchCoins = async () => {
  try {
    const container = document.getElementById("cryptoPriceContainer");
    container.classList.add("blurred");

    const response = await fetch("https://api.coinranking.com/v2/coins", options);
    const data = await response.json();
    console.log(data);

    const loadedPrices = new Set();

    const handleLoad = (price) => {
      // Dodajemy price jako argument
      loadedPrices.add(price);
      if (loadedPrices.size === 5) {
        container.classList.remove("blurred");
      }
    };

    createWebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade", document.getElementById("btcPrice"), handleLoad);
    createWebSocket("wss://stream.binance.com:9443/ws/ethusdt@trade", document.getElementById("ethPrice"), handleLoad);
    createWebSocket("wss://stream.binance.com:9443/ws/bnbusdt@trade", document.getElementById("bnbPrice"), handleLoad);
    createWebSocket("wss://stream.binance.com:9443/ws/xrpusdt@trade", document.getElementById("xrpPrice"), handleLoad);
    createWebSocket("wss://stream.binance.com:9443/ws/dotusdt@trade", document.getElementById("dotPrice"), handleLoad);

    getChangeValue(data, 0, btcPriceChange);
    getChangeValue(data, 1, ethPriceChange);
    getChangeValue(data, 3, bnbPriceChange);
    getChangeValue(data, 7, xrpPriceChange);
    getChangeValue(data, 17, dotPriceChange);
  } catch (error) {
    console.error(error);
  }
};

const createNews = async () => {
  const newsListItems = [
    document.getElementById("news1"),
    document.getElementById("news2"),
    document.getElementById("news3"),
    document.getElementById("news4"),
    document.getElementById("news5"),
  ];
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/news", options);
    const data = await response.json();

    const firstFiveNews = data.data.slice(0, 5);
    newsListItems[0].innerHTML = `<a class="news-list" href="${firstFiveNews[0].url}" target="_blank">${firstFiveNews[0].title}</a>`;
    newsListItems[1].innerHTML = `<a class="news-list" href="${firstFiveNews[1].url}" target="_blank">${firstFiveNews[1].title}</a>`;
    newsListItems[2].innerHTML = `<a class="news-list" href="${firstFiveNews[2].url}" target="_blank">${firstFiveNews[2].title}</a>`;
    newsListItems[3].innerHTML = `<a class="news-list" href="${firstFiveNews[3].url}" target="_blank">${firstFiveNews[3].title}</a>`;
    newsListItems[4].innerHTML = `<a class="news-list" href="${firstFiveNews[4].url}" target="_blank">${firstFiveNews[4].title}</a>`;
  } catch (error) {
    console.error(error);
  }
};

createNews();
fetchCoins();

// funkcja, zmieniajaca kolor roznicy procentowej w zaleznosci od tego, czy jest ona na plusie czy na minusie
function checkPriceColor(cryptoChangeID, value) {
  const cryptoChangeElement = document.getElementById(cryptoChangeID);
  if (value > 0) {
    cryptoChangeElement.style.color = "green";
  }
  if (value < 0) {
    cryptoChangeElement.style.color = "red";
  }
  if (value === 0) {
    cryptoChangeElement.style.color = "royalblue";
  }
}
function redirectTo(page) {
  window.location.href = page;
}

document.addEventListener("DOMContentLoaded", function () {
  const lazyLoadOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const lazyLoadObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const element = entry.target;
        element.classList.add("loaded"); 
        observer.unobserve(element); 
      }
    });
  }, lazyLoadOptions);

  // Wybierz elementy, które mają być leniwie ładowane
  const lazyLoadSections = document.querySelectorAll(".lazyload");

  // Obserwuj każdą sekcję
  lazyLoadSections.forEach(function (section) {
    lazyLoadObserver.observe(section);
  });
});

phoneVersionBtn.addEventListener("click", () => {
  appImage.src = "assets/phoneApp.svg";
  appImage.style.width = "10rem";
  // appImage.style.marginBottom = "2rem";
});
computerVersionBtn.addEventListener("click", () => {
  appImage.src = "assets/desktopApp.png";
  appImage.style.width = "35rem";
  // appImage.style.marginBottom = "0rem";
});
function toggleAnswer(question) {
  var answer = question.nextElementSibling;
  if (answer.style.display === "none" || answer.style.display === "") {
    answer.style.display = "block";
  } else {
    answer.style.display = "none";
  }
}
