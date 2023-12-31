// HTML template for the movie card
function createMovieCard(movie) {
    const director = movie.director ? movie.director : "N/A";
    const rating = movie.vote_average ? movie.vote_average : "N/A";

    return `
        <div class="col-6 col-lg-3 col-md-4 col-xl-2 mb-3">
            <div class="movie-container">
                <img class="movie-block" src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
                <div class="img-overlay">
                    <h4>${movie.title}</h4>
                    <p>Director: ${director} <br> Rating: ${rating}</p>
                    <button type="button" class="btn">
                        <div class="row movie-links">
                            <div class="col-8">
                            <img class="btn-movies" src="../assets/Retro-btn.svg" onclick="addToLocalStorageAndGoToMovie('${movie.title}','${director}','${rating}','${movie.description}','${movie.genres}','${movie.poster_path}')">
                            </div>
                            <div class="col-4">
                                <img class="add-btn" src="../assets/Add-btn.svg" onclick="addToWatchList('${movie.title}','${director}','${rating}','${movie.description}','${movie.genres}','${movie.poster_path}')">
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>`;
}


// Clear the movieContainer
const movieContainer = $('#movieContainer');
movieContainer.empty();

const apiKey = '721f6c1ba010dd467b63985221a03ae9';


let selectedGenreValue = "";
let selectedYearValue = "";
let selectedImbdScore = "";



function fetchMovies(page) {
    const tmdbEndpoint = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&include_video=true&language=en-USappend_to_response=credits,images&page=${page}${selectedYearValue}${selectedGenreValue}${selectedImbdScore}`;
    movieContainer.empty();
// API
    $.ajax({
        url: tmdbEndpoint,
        method: 'GET',
        success: function (data) {
            const movies = data.results.slice(0, 60); // Load only 25 movies

            movies.forEach(function (movie, index) {
                console.log(`Movie ${index + 1}:`);
                console.log(`Title: ${movie.title}`);
    
                const movieId = movie.id;
                const movieDetailsEndpoint = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US&append_to_response=credits,images`;
    
                $.ajax({
                    url: movieDetailsEndpoint,
                    method: 'GET',
                    success: function (movieDetails) {
                        const director = movieDetails.credits.crew.find(person => person.job === "Director");                                         
                        const genresArr = [];
    
                        movieDetails.genres.forEach(function(genre){
                            genresArr.push(genre.name);
                        });
    
                        // Create the movie card HTML and append it to the container
                        const movieCard = createMovieCard({
                            title: movie.title,
                            director: director ? director.name : "N/A",
                            vote_average: movie.vote_average,
                            poster_path: movie.poster_path,
                            description: movieDetails.overview,
                            genres: genresArr
                        });
    
                        // Append the card to the container
                        movieContainer.append(movieCard);

                            
                    },
                    error: function (error) {
                        console.log('Error:', error);
                    }
                    
                });
            });
        },
        error: function (error) {
            console.log('Error:', error);
        }
           
    });
}

// Fetch movies from more pages
fetchMovies(2); 
fetchMovies(3); 
fetchMovies(4); 

           
// Add to Watchlist button

function addToWatchList(title,director,rating, description, genres, imageurl){
    console.log(genres)
    const temp = {
        'title':title,
        'director':director,
        'rating':rating,
        'description':description,
        'genres':genres,
        'imgUrl':imageurl
    }

    if(localStorage.getItem('watchList') === null){
        localStorage.setItem('watchList',JSON.stringify([temp]));
    }
    else{
        const watchList = JSON.parse(localStorage.getItem('watchList'));
        watchList.push(temp);
        localStorage.setItem('watchList',JSON.stringify(watchList));
    }
 

}

// Watch now Button

function addToLocalStorageAndGoToMovie(title, director, rating, description, genres, imageurl, cast, boxOffice, backdrop_path) {
    // Create an object with the movie data, including the ID
    const temp = {
        'title': title,
        'director': director,
        'rating': rating,
        'description': description,
        'genres': genres,
        'imgUrl': imageurl,
        'actors': cast,
        'box-office': boxOffice,
        'backdrop_path': backdrop_path,
    };

    // Check if local storage already contains a 'movies' key
    if (localStorage.getItem('movies') === null) {
        // If not, create a new array and add the movie data
        localStorage.setItem('movies', JSON.stringify([temp]));
    } else {
        // If it exists, retrieve the existing data, add the new movie data, and update local storage
        const movies = JSON.parse(localStorage.getItem('movies'));
        movies.push(temp);
        localStorage.setItem('movies', JSON.stringify(movies));
    }

    // Redirect to the website
    window.location.href = '../pages/movie.html';

    
}

// -------------------------------------
// Fetch Genres

let genreArray = [];

const genrePromise = fetch('https://api.themoviedb.org/3/genre/movie/list?language=en')
.then(response => response.json())
.then(data => {
    let genreArrayData = data;
    genreArray = genreArrayData.genres;
})
.catch(err => console.error(err))

// --------------------------------------
// Filter

$(document).ready(function() {

    genrePromise.then(() => {
        const option = document.getElementById('genreFilter');
        option.value = movie.id;
        option.text = movie.name;
        select.appendChild(option);
    })
})

function displayGenre(genreNumber){
    selectedGenreValue="";
    [...document.getElementsByClassName('genre')].forEach((el) => {
        el.style.color = 'white';
    });
      
    document.getElementById('genre-'+genreNumber).style.color = '#BB2525';
    selectedGenreValue = "&with_genres=" + genreNumber;
    fetchMovies(1);
}

function displayYear(yearNumber){
    selectedYearValue="";
    [...document.getElementsByClassName('year')].forEach((el) => {
        el.style.color = 'white';
    });
      
    document.getElementById('year-'+yearNumber).style.color = '#BB2525';
    selectedYearValue = "&primary_release_year=" + yearNumber;
    fetchMovies(1);
}

function displayScore(scoreNumber){
    selectedImbdScore="";
    [...document.getElementsByClassName('score')].forEach((el) => {
        el.style.color = 'white';
    });
      
    document.getElementById('score-'+scoreNumber).style.color = '#BB2525';
    selectedImbdScore = "&vote_average.gte=" + scoreNumber;
    fetchMovies(1);
}

function allFilter(){
    selectedGenreValue="";
    selectedYearValue="";
    selectedImbdScore="";
    [...document.getElementsByClassName('genre')].forEach((el) => {
        el.style.color = 'white';
    });
    [...document.getElementsByClassName('year')].forEach((el) => {
        el.style.color = 'white';
    });
    [...document.getElementsByClassName('score')].forEach((el) => {
        el.style.color = 'white';
    });
    fetchMovies(1);
}