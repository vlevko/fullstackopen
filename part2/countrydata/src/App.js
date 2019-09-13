import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Language = (props) => {
  return <li>{props.name}</li>;
}

const Languages = ({ languages }) => {
  return (
    <ul>
      {languages.map(language =>
        <Language
          key={language.name}
          name={language.name}
        />
      )}
    </ul>
  );
}

const Country = ({ country }) => {
  const [weatherIcon, setWeatherIcon] = useState('#');
  const [weatherTemp, setWeatherTemp] = useState(0);
  const [weatherWind, setWeatherWind] = useState(0);
  const [weatherWindDirection, setWeatherWindDirection] = useState('');
  const weatherApiKey = ''; // use your apixu.com API key

  useEffect(() => {
    axios
      .get(`https://api.apixu.com/v1/current.json?key=${weatherApiKey}&q=${country.capital}`)
      .then(response => {
        const weatherIconUrl = response.data.current.condition.icon;
        const weatherTempValue = response.data.current.temp_c;
        const weatherWindValue = response.data.current.wind_kph;
        const weatherWindDirectionValue = response.data.current.wind_dir;

        setWeatherIcon(weatherIconUrl);
        setWeatherTemp(weatherTempValue);
        setWeatherWind(weatherWindValue);
        setWeatherWindDirection(weatherWindDirectionValue);
      });
  });

  return (
    <div>
      <h2>{country.name}</h2>
      <div>capital {country.capital}</div>
      <div>population {country.population}</div>
      <h3>languages</h3>
      <Languages
        languages={country.languages}
      />
      <div><img src={country.flag} alt="country flag" height="100px"/></div>
      <h3>Weather in {country.capital}</h3>
      <div><strong>temperature:</strong> {weatherTemp} Celsius</div>
      <div><img src={weatherIcon} alt="weather icon" /></div>
      <div><strong>wind:</strong> {weatherWind} kph direction {weatherWindDirection}</div>
    </div>
  );
}

const CountriesList = (props) => {
  return (
    <div>
      {props.name} <button value={props.name} onClick={props.showHandler}>show</button>
    </div>
  );
}

const Countries = (props) => {
  if (props.response) {
    return <div>{props.response}</div>;
  } else if (props.countries.length > 1) {
    return (props.countries.map(country =>
      <CountriesList
        key={country.name}
        name={country.name}
        showHandler={() => props.showHandler(country.name)}
      />
    ));
  } else if (props.countries.length === 1) {
    return (
      <Country
        country={props.countries[0]}
      />
    );
  }
  return null;
}

const App = () => {
  const [countries, setCountries] = useState([]);
  const [countriesToShow, setCountriesToShow] = useState([]);
  const [newFilter, setNewFilter] = useState('');
  const [response, setResponse] = useState('');

  const handleFilterChange = (event) => {
    const value = event.target.value;
    const filteredCountries = countries.filter(country => country.name.toLowerCase().includes(value.toLowerCase()));

    setNewFilter(value);
    if (!value || filteredCountries.length === 0) {
      setResponse('');
      setCountriesToShow([]);
    } else if (filteredCountries.length <= 10) {
      setResponse('');
      setCountriesToShow(filteredCountries);
    } else {
      setResponse('Too many matches, specify another filter');
      setCountriesToShow([]);
    }
  }

  const handleShowClick = (name) => {
    const filteredCountries = countries.filter(country => country.name.toLowerCase().includes(name.toLowerCase()));

    setNewFilter(name);
    if (filteredCountries.length <= 10) {
      setResponse('');
      setCountriesToShow(filteredCountries);
    } else {
      setResponse('Too many matches, specify another filter');
      setCountriesToShow([]);
    }
  }

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data);
      });
  }, []);

  return (
    <div>
      <div>
        find countries <input
          type="text"
          value={newFilter}
          onChange={handleFilterChange}
        />
      </div>
      <Countries
        countries={countriesToShow}
        response={response}
        showHandler={handleShowClick}
      />
    </div>
  );
}

export default App;
