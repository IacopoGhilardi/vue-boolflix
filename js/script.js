const app = new Vue({

    el: "#root",
    data: {
        imgPath: 'https://image.tmdb.org/t/p/w220_and_h330_face/',
        search:'',
        shows: [],
        genreList: []
    },
    methods: {
        flagImg(movie) {
            if (movie.original_language == "it" || movie.original_language == "en") {
                return ("img/" + movie.original_language.toLowerCase() + ".png");
            } else return false;
        },
        movieRate(movie) {
            return Math.ceil(movie.vote_average / 2);
        },
        getGenre(arrOfGenre) {         
            const elementArr = [];   
            this.genreList.forEach(element => {
                if (arrOfGenre.includes(element.id)) {
                    elementArr.push(element.name);
                }
            });
            console.log(elementArr);
            if (elementArr.length > 5) {
                elementArr.length = 5;
            }
            return elementArr;
        },
        //funzione search
        searchMovie(){
            axios.all([
                //chiamata API movie
                axios.get('https://api.themoviedb.org/3/search/movie',
                {
                    params: {
                        api_key: '63d036c152cd4651d8a116600d977c32',
                        query: this.search,
                        language: 'it-IT'
                    }
                }),
                //chiamata API serie
                axios.get('https://api.themoviedb.org/3/search/tv',
                {
                    params: {
                        api_key: '63d036c152cd4651d8a116600d977c32',
                        query: this.search,
                        language: 'it-IT'
                    }
                }),
                axios.get('https://api.themoviedb.org/3/genre/movie/list',
                {
                    params: {
                        api_key: '63d036c152cd4651d8a116600d977c32',
                        query: this.search,
                        language: 'it-IT'
                    }
                }),
                axios.get('https://api.themoviedb.org/3/genre/tv/list',
                {
                    params: {
                        api_key: '63d036c152cd4651d8a116600d977c32',
                        query: this.search,
                        language: 'it-IT'
                    }
                })
            ])
            .then(axios.spread((movies, tvshows, genreMovies, genreShows) => {
                //salvo i risultati nell'array movies
                const moviesArr = movies.data.results;
                const tvShows = tvshows.data.results;
                const showsGenreList = genreShows.data.genres;
                const movieGenreList = genreMovies.data.genres;

                this.genreList = movieGenreList.concat(showsGenreList);
                console.log(this.genreList);
                this.shows = moviesArr.concat(tvShows);   
                console.log(this.shows);    
            }));
            this.search = '';
        },
        reset() {
            this.movies = [];
        }
    }
});