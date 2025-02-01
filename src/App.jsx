import React from "react";
import Search from "./components/search.jsx";
import { useEffect, useState } from "react";
import spinner from "./components/spinner.jsx";
import Card from "./components/card.jsx";

// API call
const API_BASE_URL = "https://api.themoviedb.org/3";
// import.meta.env.VITE_API_KEY is a built-in variable that allows you to access environment variables
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
// API options
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMassage, setErrorMassage] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch movies
  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMassage("");

    try {
      const endPoint = query 
      ?  `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`

      const response = await fetch(endPoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Something went wrong while fetching the data");
      }
      const data = await response.json();

      if (data.response === "False") {
        setErrorMassage(data.Error || "Failed to fetch movies");
        setMovies([]);
        return;
      }

      setMovies(data.results || []);
    } catch (error) {
      console.error(`Error: ${error}`);
      setErrorMassage("Something went wrong while fetching the movies data");
    } finally {
      setIsLoading(false);
    }
  };

  // API call
  useEffect(() => {
    console.log("API Key:", API_KEY); // Cek API key
    fetchMovies(searchTerm);
  }, [searchTerm]);

  return (
    <main>
      <div className="pattern"></div>

      <div className="wrapper">
        <header>
          <img src="../public/hero-img.png" alt="Hero Image" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy Without The Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>

          {isLoading ? (
            <spinner/>
          ) : errorMassage ? (
            <p className="text-red-500">{errorMassage}</p>
          ) : (
            <ul>
              {movies.map((movie) => (
                <Card key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
