// selectors ====================================================================================

// current day ---------------------------------------------
const search = document.querySelector("section .search input");
const day = document.querySelectorAll("section .card .header span"); // today > [0] & tomorrow > [2] & after tomorrow > [3]
const dayNum_andMonth = document.querySelector(
  "section .card .header span:nth-child(2)"
);
const region = document.querySelector("section .card .body h4"); // .location.name
const temp = document.querySelectorAll("section .card .body figcaption"); // .current.temp_c  ------  for current temp > [0] |  tomorrow > max>[1](.forecast.forecastday[1].day.maxtemp_c)&min>[2](.forecast.forecastday[1].day.mintemp_c)  |  after tomorrow max>[3]$min>[4]
const condition = document.querySelectorAll("section .card .body span"); // .current.condition.text  -------- todayCon > [0] & tomorrowCon > [1]  & after tomorrowCon > [2]
const icon = document.querySelectorAll("section .card .body figure img"); // .current.condition.icon  ----------  todayIcon > [0] & tomorrowIcon > [1](.forecast.forecastday[1].day.condition.icon)  & after tomorrowIcon > [2]
const humidity = document.querySelector(
  "section .card .footer span:nth-child(1)"
); // .current.humidity
const wind_speed = document.querySelector(
  "section .card .footer span:nth-child(2)"
); // .current.condition.wind_kph
const wind_dir = document.querySelector(
  "section .card .footer span:nth-child(3)"
); // .current.wind_dir
const loooooding = document.querySelector(".spinner-grow");

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const monthName = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// check if browser support geolocation
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(success, error);
}

// functions ====================================================================================

async function getData(loc = "cairo") {
  startLooding();

  const url = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=f241389e76b1460abbe01443232608&q=${loc}&days=3`
  );
  allData = await url.json();
  console.log("end loooooding");
  displayData(allData);
  endLooding();
}

function displayData(data) {
  if (data.location == undefined) {
    console.log("do nothing or show alert"); // when location not found do nothing or show alert
  } else {
    const date = new Date(data.forecast.forecastday[0].date);
    // current day info ---------------------------------------------
    day[0].innerHTML = weekDays[date.getDay()];
    dayNum_andMonth.innerHTML = date.getDate() + monthName[date.getMonth()];
    region.innerHTML = data.location.name;
    temp[0].innerHTML = data.current.temp_c + "&deg;C";
    condition[0].innerHTML = data.current.condition.text;
    icon[0].setAttribute("src", data.current.condition.icon);
    humidity.innerHTML = data.current.humidity + "%";
    wind_speed.innerHTML = data.current.wind_kph + "km/h";
    wind_dir.innerHTML = data.current.wind_dir;

    //tomorrow ---------------------------------------------
    day[2].innerHTML = weekDays[date.getDay() + 1 > 6 ? 0 : date.getDay() + 1];
    temp[1].innerHTML = data.forecast.forecastday[1].day.maxtemp_c + "&deg;C"; // max temp
    temp[2].innerHTML = data.forecast.forecastday[1].day.mintemp_c + "&deg;C"; // min temp
    condition[1].innerHTML = data.forecast.forecastday[1].day.condition.text;
    icon[1].setAttribute(
      "src",
      data.forecast.forecastday[1].day.condition.icon
    );

    //after tomorrow ---------------------------------------------
    day[3].innerHTML = weekDays[date.getDay() + 2 > 6 ? 1 : date.getDay() + 2];
    temp[3].innerHTML = data.forecast.forecastday[2].day.maxtemp_c + "&deg;C"; // max temp
    temp[4].innerHTML = data.forecast.forecastday[2].day.mintemp_c + "&deg;C"; // min temp
    condition[2].innerHTML = data.forecast.forecastday[2].day.condition.text;
    icon[2].setAttribute(
      "src",
      data.forecast.forecastday[2].day.condition.icon
    );
  }
}

function success(pos) {
  getData(`${pos.coords.latitude} ${pos.coords.longitude}`);
}
function error(err) {
  console.log("Error " + err.code + " || " + err.message);
  getData(); // when get error or user refused to give location function will called with defualt param
}

function startLooding() {
  loooooding.classList.remove("d-none");
}

function endLooding() {
  loooooding.classList.add("d-none");
}

// events ====================================================================================
search.addEventListener("keyup", function () {
  if (this.value.length > 2) {
    getData(this.value);
  }
});
