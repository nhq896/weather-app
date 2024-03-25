import React, { useState } from "react";
import { BsSearch } from "react-icons/bs";
import "./App.css";
import humidity_img from "./assets/images/humidity.png";
import wind_img from "./assets/images/wind.png";
import { Spinner } from "flowbite-react";

const App = () => {
  const [input, setInput] = useState("");
  const [weather, setWeather] = useState({
    loading: false,
    data: {},
    error: false,
  });
  const toDateFunction = () => {
    const months = [
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
    const WeekDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const currentDate = new Date();
    const date = `${WeekDays[currentDate.getDay()]} ${currentDate.getDate()} ${
      months[currentDate.getMonth()]
    }`;
    return date;
  };

  const handleSearch = async () => {
    setWeather({ ...weather, loading: true, error: false });
    setInput("");
    await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${input}&units=metric&appid=f00c38e0279b7bc85480c3fe775d518c`
      // `${process.env.APP_API_URL}?q=${input}&units=metric&appid=${process.env.APP_API_KEY}`
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("City not found!");
      })
      .then((data) => {
        setWeather({ data, loading: false, error: false });
      })
      .catch((err) => {
        setWeather({ ...weather, loading: false, error: err.message });
      });
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center text-white bg-indigo-100">
      <h2 className="text-[#333] font-bold text-5xl mb-6">Weather App</h2>
      <div className="shadow-2xl shadow-[#13075498] rounded-xl bg-gradient-to-b from-[#130754] to-[#3b2f80] p-8 flex flex-col items-center">
        <form
          className="flex gap-3 w-full justify-center text-black px-10"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(input);
          }}
        >
          <input
            type="text"
            placeholder="Enter city name..."
            className="rounded-2xl border-2 border-gray-300 min-w-[60%] px-3"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
          <button
            type="submit"
            className="bg-white rounded-full p-3 border-2 border-gray-200"
          >
            <BsSearch />
          </button>
        </form>
        {weather.loading && <Spinner className="size-14 mt-5" />}
        {weather.error && (
          <div className="mt-5 w-full font-semibold text-center text-amber-300">
            {weather.error}
          </div>
        )}
        {weather?.data?.main && (
          <>
            <h2 className="text-3xl font-bold mt-5">
              {weather.data.name}, {weather.data.sys.country}
            </h2>
            <p className="text-gray-300">{toDateFunction()}</p>
            <div className="flex relative px-20">
              <img
                src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
                className="size-28"
                alt=""
              />
              <div className="font-bold text-4xl absolute bottom-0 left-[60%]">
                <span className="">{Math.round(weather.data.main.temp)}</span>
                <sup className="font-semibold text-base absolute top-0">°C</sup>
              </div>
            </div>
            <div className="mt-10 flex justify-between w-full p-4 whitespace-nowrap text-gray-100">
              <div className="flex items-center gap-2">
                <img src={humidity_img} className="size-6" alt="" />
                <span>
                  <p>{weather.data.main.humidity}%</p>
                  <p>Humidity</p>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <img src={wind_img} className="size-6" alt="" />
                <span>
                  <p>{weather.data.wind.speed} km/h</p>
                  <p>Wind speed</p>
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
