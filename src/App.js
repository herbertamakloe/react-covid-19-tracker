import {
	FormControl,
	Select,
	MenuItem,
	Card,
	CardContent,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import "./App.css";
import InfoBox from "./components/InfoBox";
import LineGraph from "./components/LineGraph";
import Map from "./components/Map";
import Table from "./components/Table";
import { sortData } from "./util";
import "leaflet/dist/leaflet.css";

function App() {
	const [countries, setCountries] = useState([]);
	const [country, setCountry] = useState("Worldwide");
	const [countryInfo, setCountryInfo] = useState({});
	const [tableData, setTableData] = useState([]);
	const [mapZoom, setMapZoom] = useState(3);
	const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });

	useEffect(() => {
		fetch("https://disease.sh/v3/covid-19/all")
			.then((response) => response.json())
			.then((data) => {
				setCountryInfo(data);
			});
	}, []);

	//useEffect = runs a piece of code based on a given condition

	useEffect(() => {
		/*The code inside here will run once
    when the component loads and not again
    because of the empty square brackets passed in as 
    the second parameter of the useEffect function.
    Without those square brackets, useEffect will
    be called again and again anytime the component loads*/

		//async -> send a request, wait for it, do something with info
		const getCounntriesData = async () => {
			await fetch("https://disease.sh/v3/covid-19/countries")
				.then((response) => response.json())
				.then((data) => {
					const countries = data.map((country) => {
						return {
							name: country.country, //United Staes, Ghana
							value: country.countryInfo.iso2, //UK, USA, GH
						};
					});

					const sortedData = sortData(data);
					setTableData(sortedData);
					setCountries(countries);
				});
		};

		getCounntriesData();
	}, []);

	const handleCountrySelect = async (event) => {
		const countryCode = event.target.value;
		setCountry(countryCode);

		//https://disease.sh/v3/covid-19/all
		//https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]

		const url =
			countryCode === "worldwide"
				? "https://disease.sh/v3/covid-19/all"
				: `https://disease.sh/v3/covid-19/countries/${countryCode}`;

		await fetch(url)
			.then((response) => response.json())
			.then((data) => {
				setCountry(countryCode);
				setCountryInfo(data);

				setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
				setMapZoom(4);
			});
	};

	console.log("info", countryInfo);

	return (
		<div className="app">
			{/* Left side of the board */}
			<div className="app__left">
				{/* Header */}
				{/* Title + Select input dropdown field */}
				<div className="app__header">
					<h1>Covid-19 Tracker App</h1>
					<FormControl className="app__dropdown">
						<Select
							variant="outlined"
							value={country}
							onChange={handleCountrySelect}
						>
							<MenuItem value="Worldwide">Worldwide</MenuItem>
							{/* Loop through all the countries and show a dropdown list of the options */}
							{countries.map((country) => {
								console.log(countries);
								return (
									<MenuItem value={country.value}>{country.name}</MenuItem>
								);
							})}
						</Select>
					</FormControl>
				</div>

				<div className="app__stats">
					{/* Info Boxes title="*/}
					<InfoBox
						title="Coronavirus Cases"
						total={countryInfo.cases}
						cases={countryInfo.todayCases}
					/>
					{/* Info Boxes */}
					<InfoBox
						title="Recovered"
						total={countryInfo.recovered}
						cases={countryInfo.todayRecovered}
					/>
					{/* Info Boxes */}
					<InfoBox
						title="Deaths"
						total={countryInfo.deaths}
						cases={countryInfo.todayDeaths}
					/>
				</div>

				{/* Map */}
				<Map center={mapCenter} zoom={mapZoom} />
			</div>

			{/* Right side of the board */}
			<Card className="app__right">
				<CardContent>
					{/* Table */}
					<h3>Live Cases by Country</h3>
					<Table countries={tableData} />
					{/* Graph */}
					<h3>Worldwide new cases</h3>
					<LineGraph />
				</CardContent>
			</Card>
		</div>
	);
}

export default App;
