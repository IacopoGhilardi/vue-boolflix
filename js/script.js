const app = new Vue({

    el: "#root",
    data: {
        imgPath: 'https://image.tmdb.org/t/p/w220_and_h330_face/',
        search:'',
        genreList: [],
        tvShows: [],
        movies: []
    },
    mounted(){
        //richiamo le api per avere le opzioni della selection dei generi
        axios.all([
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
        .then(axios.spread((genreMovies, genreShows) => {
            //salvo i risultati nell'array dei generi
            const movieGenreList = genreMovies.data.genres;
            const showsGenreList = genreShows.data.genres;
            
            movieGenreList.forEach(element => {
                showsGenreList.forEach((item, index) => {
                    if (element.id == item.id) {
                        showsGenreList.splice(index, 1);
                    }
                });
            });
            this.genreList = movieGenreList.concat(showsGenreList);
        }));
    },
    methods: {
        //gestione della bandiera
        flagImg(movie) {
            if (movie.original_language == "it" || movie.original_language == "en") {
                return ("img/" + movie.original_language.toLowerCase() + ".png");
            } else return false;
        },
        //gestisco il voto
        movieRate(movie) {
            return Math.ceil(movie.vote_average / 2);
        },
        //gestione dei generi
        getGenre(arrOfGenre) {         
            const elementArr = [];   
            this.genreList.forEach(element => {
                if (elementArr.length == 5) {
                    return elementArr;
                } else if (arrOfGenre.includes(element.id)) {
                    elementArr.push(element.name);
                }
            });
            return elementArr;
        },
        //ricerca del cast
        getMovieCast: async function(el){
            const cast = [];
            //chiamata api per avere credits
            await axios.get(`https://api.themoviedb.org/3/movie/${el.id}/credits`, {
                params: {
                    api_key: '63d036c152cd4651d8a116600d977c32'
                }
            })
            .then((response) => {
                    let result = response.data.cast;
                    for(let i = 0; i < result.length; i++) {
                        if (cast.length == 5) {
                            return cast;
                        } else cast.push(element.name);
                    }
            })
            console.log(cast);
            return cast;
        },
        getShowsCast: async function(el){
            const cast = [];
            //chiamata api per avere credits
            await axios.get(`https://api.themoviedb.org/3/tv/${el.id}/credits`, {
                params: {
                    api_key: '63d036c152cd4651d8a116600d977c32'
                }
            })
            .then((response) => {
                    let result = response.data.cast;
                    result.forEach(element => {
                        if (cast.length == 5) {
                            return cast;
                        } else {
                         cast.push(element.name);
                         }
                            
                    });
                    
            })
            console.log(cast);
            return cast;
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
            .then(axios.spread((call1, tvshows) => {
                //salvo i risultati nell'array movies
                this.movies = call1.data.results;
                this.tvShows = tvshows.data.results; 
            }));
            this.search = '';
        },
        reset() {
            this.shows = [];
        }
    }
});