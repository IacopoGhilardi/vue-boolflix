const app = new Vue({

    el: "#root",
    data: {
        imgPath: 'https://image.tmdb.org/t/p/w220_and_h330_face/',
        search:'',
        shows: []
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
                })
            ])
            .then(axios.spread((movies, tvshows) => {
                //salvo i risultati nell'array movies
                const moviesArr = movies.data.results;
                const tvShows = tvshows.data.results;

                this.shows = moviesArr.concat(tvShows);        
            }));
            this.search = '';
        },
        reset() {
            this.movies = [];
        }
    }
});