import axios from "axios";
import React, { useState, useEffect } from "react";

function Week(props) {
  const cityName = props.city;
  const [weather, setWeather] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=eb51365bdc8c969bc8767aa167151a0a&units=metric&lang=es`
        );

        const groupedData = response.data.list.reduce((acc, obj) => {
          const date = obj.dt_txt.split(" ")[0];

          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(obj);
          return acc;
        }, {});
        const dailyData = Object.keys(groupedData).map((date) => {
          const tempObjList = groupedData[date].map((obj) => obj.main);
          const avgTemp =
            tempObjList.reduce((acc, tempObj) => acc + tempObj.temp, 0) /
            tempObjList.length;
          const avgPrecip =
            groupedData[date].reduce(
              (acc, obj) =>
                acc + (obj.hasOwnProperty("rain") ? obj.rain["3h"] : 0),
              0
            ) / tempObjList.length;
          const avgClouds =
            groupedData[date].reduce((acc, obj) => acc + obj.clouds.all, 0) /
            groupedData[date].length;
          const avgHumidity =
            tempObjList.reduce((acc, tempObj) => acc + tempObj.humidity, 0) /
            tempObjList.length;
          const avgWindSpeed =
            groupedData[date].reduce((acc, obj) => acc + obj.wind.speed, 0) /
            groupedData[date].length;
          const icon = groupedData[date][0].weather[0].icon.slice(0, -1) + "d";
          return {
            date: date,
            temp: avgTemp.toFixed(1),
            precip: avgPrecip.toFixed(1),
            clouds: avgClouds.toFixed(1),
            humidity: avgHumidity.toFixed(1),
            windSpeed: avgWindSpeed.toFixed(1),
            icon: icon,
          };
        });

        setWeather(dailyData);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, [cityName]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div
          className="h-52 w-52 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="shadow-xl md:bg-black md:bg-opacity-20 md:gap-0 md:mx-4 md:rounded-xl gap-1 h-[%40] mb-5 p-1 md:p-0 grid md:grid-cols-5 grid-cols-3 md:divide-x-[0.5px]">
      {weather.map((data, index) => (
        <div
          key={index}
          className="flex flex-col md:bg-transparent bg-black bg-opacity-20 md:rounded-none rounded-xl justify-center items-center p-2 md:p-2"
        >
          <div className="md:text-sm text-xs md:font-bold mb-2 tracking-wider">
            {`${data.date.substring(8)}/${data.date.substring(
              5,
              7
            )}/${data.date.substring(0, 4)}`}
          </div>

          <div className="text-2xl font-bold mb-2">
            {Math.round(data.temp)} °C
          </div>
          <img
            src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
            id="img-shadow-2"
            alt={`icon ${data.icon}`}
            className="h-20 m-2 drop-shadow-2xl"
          />
          <div className="md:text-base text-xs">Precipitaciones: {data.precip} mm</div>
          <div className="md:text-base text-xs">Nubosidad: {data.clouds}%</div>
          <div className="md:text-base text-xs">Humedad: {data.humidity}%</div>
          <div className="md:text-base text-xs">
            Viento: {data.windSpeed} m/s
          </div>
        </div>
      ))}
    </div>
  );
}

export default Week;
