import edit from "../assets/Edit_icon.png";
import cancel from "../assets/Cancel_icon.png";
import send from "../assets/Send_icon.png";
import Swal from "sweetalert2";
import axios from "axios";
import React, { useState, useEffect } from "react";

import Week from "./Week";

function Home() {
  const [weather, setWeather] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [cityName, setCityName] = useState("New York");
  const [err, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=eb51365bdc8c969bc8767aa167151a0a&units=metric&lang=es`
        );
        setWeather(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);

        setIsLoading(false);
      }
    }

    fetchData();
  }, [cityName]);


  function handleEdit() {
    setEditing(!editing);
  }

  function handleInputChange(e) {
    setCityName(e.target.value);
  }

  function handleSend() {
    handleCityNameChange(cityName);
  }

  function handleCityNameChange(cityName) {
    const normalizedCityName = cityName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${normalizedCityName}&appid=eb51365bdc8c969bc8767aa167151a0a&units=metric&lang=es`;
    setIsLoading(true);
    axios
      .get(apiUrl)
      .then((response) => {
        setWeather(response.data);
        setIsLoading(false);
        setError("");
        setEditing(!editing);
      })
      .catch((error) => {
        
        console.log(err);
        setIsLoading(false);
        setEditing(!editing);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "La ciudad ingresada no fue encotrada!",
        });
      });
  }

  function getCurrentDate() {
    const date = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  }
  

  function getBackgroundColor(temp) {
    if (temp < 5) {
      return "from-stone-800 to-slate-500";
    } else if (temp < 10) {
      return "from-blue-900 to-cyan-500";
    } else if (temp < 20) {
      return "from-sky-950 to-cyan-800";
    } else if (temp < 33) {
      return "from-orange-900 to-amber-300";
    } else {
      return "from-red-600 to-orange-600";

    }
  }
  if (isLoading) {
    return (
      <div class="fixed inset-0 flex items-center justify-center">
  <div
    class="h-52 w-52  animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
    role="status"
  >
    <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
      Loading...
    </span>
  </div>
</div>

    );
  }

  return (
    <div
      className={`md:h-screen flex flex-col justify-between bg-gradient-to-br from-10% ${getBackgroundColor(weather.main.temp)} text-white`}
    >
      <div className="items-center md:m-10 m-5 flex justify-between ">
        <div className="flex flex-col justify-center w-full">
          <div className="flex flex-row md:mb-10 mb-2 items-center">
            {editing ? (
              <>
                <input
                  type="text"
                  placeholder="Type city name"
                  onBlur={handleInputChange}
                  className="shadow-xl input w-1/2 max-w-xs bg-white bg-opacity-10"
                />
                <button onClick={handleSend}>
                  <img
                    src={send}
                    alt="send icon"
                    className=" h-8 ml-2 hover:p-1 transition-all duration-150"
                  />
                </button>
                <button onClick={handleEdit}>
                  <img
                    src={cancel}
                    alt="cancel icon"
                    className=" h-8 ml-2 hover:p-1 transition-all duration-150"
                  />
                </button>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold">{weather.name}</h1>
                <button onClick={handleEdit}>
                  <img
                    src={edit}
                    alt="edit icon"
                    className=" h-8 ml-2 hover:p-1 transition-all duration-150"
                  />
                </button>
              </>
            )}
          </div>

          <div className="flex md:flex-row flex-col md:mt-0 mt-8 md:justify-between w-full">
          <h1 className="md:hidden text-2xl mb-4 m-auto  capitalize">{getCurrentDate()}</h1>

            <div className="md:h-auto h-min flex  items-center md:justify-normal md:m-0 justify-center m-auto shadow-2xl bg-white bg-opacity-5 rounded-xl p-2">
             
             <div className="flex flex-col justify-center ">
                
              <h1 className="md:text-9xl text-5xl">{Math.round(weather.main.temp)}°</h1>

              <h1 className="md:text-2xl text-sm pl-2 capitalize">
                  {weather.weather[0].description}
                </h1>
              </div>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon.slice(0, -1) + "d"}@2x.png`}
                id="img-shadow"
                alt={`icon ${weather.weather[0].icon}`}
                className="md:h-32 h-20 m-2 drop-shadow-2xl"
              />
              <div className="flex flex-col border-l-2 h-full p-2 justify-center items-center gap-10">
                <h1 className="md:text-4xl text-xl">
                  Max: {Math.round(weather.main.temp_max)}°
                </h1>
                <h1 className="md:text-4xl text-xl">
                  Min: {Math.round(weather.main.temp_min)}°
                </h1>
              </div>
            </div>
            <div className="m-auto md:mr-0 w-full md:w-1/3 md:text-xl my-12 bg-white bg-opacity-5 rounded-xl justify-center items-center p-4 shadow-2xl">
              <h1>
                Precipitaciones:{" "} 
                {weather.rain !== undefined ? weather.rain['1h'] + "mm" : "0mm"}
              </h1>
              <h1>Humedad: {weather.main.humidity}%</h1>
              <h1>
                Viento: {weather.wind.speed} m/s | Direccion: {weather.wind.deg}
                °
              </h1>
              <h1>Visibilidad: {weather.visibility / 1000} Km</h1>
              <h1>Nubosidad: {weather.clouds.all}%</h1>
              <h1>
                
                {weather.snow !== undefined ? "Nieve: " + weather.snow['1h'] + "mm" : ""}
              </h1>
            </div>
          </div>

          <h1 className="md:text-4xl text-2xl md:visible invisible md:m-0 capitalize md:mt-5">{getCurrentDate()}</h1>
        </div>
      </div>
      <Week city={weather.name}/>
      <footer className="absolute md:top-2 md:right-12 top-1 right-1 text-[8px] md:text-sm">» Designed & Built by Esteban Horn «</footer>
    </div>
  );
}

export default Home;
