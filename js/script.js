const app = new Vue({

    el: "#root",
    data: {
        imgPath: 'https://image.tmdb.org/t/p/w220_and_h330_face/',
        search:'',
        genreList: [],
        showsList: [],
        popularMovies: [],
        popularTvShows: [],
        filteredShowList: [],
        mykey: '63d036c152cd4651d8a116600d977c32',
        select: ''
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
        checkLastIndex(element, arr){
            if (arr.indexOf(element) == arr.length - 1) {
                return false;
            } else return true;
        },
        //gestione dei generi
        getGenre(arrOfGenre) {         
            const genreList = [];   
            this.genreList.forEach(element => {
                if (arrOfGenre.includes(element.id)) {
                    genreList.push(element.name);
                }
            });
            return genreList;
        },
        filterByGenre(){
            if (this.select == ''){
                this.filteredShowList = this.showsList;
            } else {
                this.filteredShowList = this.showsList.filter((element) => {
                    return element.genre_ids.includes(this.select.id);
                });
            }
        },
        //calcolo l'array dei nomi del cast
        getCastName(actorsArr){
            const cast = [];

            actorsArr.forEach(element => {
                if (cast.length <= 5) {
                    cast.push(element.name);
                } else return cast;
            });

            return cast;
        },
        //funzione search
        searchMovie(){
            if (this.search != '') {
                this.reset();
                axios.all([
                    //chiamata API movie
                    axios.get('https://api.themoviedb.org/3/search/movie',
                    {
                        params: {
                            api_key: this.mykey,
                            query: this.search,
                            language: 'it-IT'
                        }
                    }),
                    //chiamata API serie
                    axios.get('https://api.themoviedb.org/3/search/tv',
                    {
                        params: {
                            api_key: this.mykey,
                            query: this.search,
                            language: 'it-IT'
                        }
                    })
                ])
                .then(axios.spread((call1, call2) => {
                    //salvo i risultati nell'array movies
                    const movies = call1.data.results;
                    const tvShows = call2.data.results;
    
                    for(let i = 0; i < movies.length; i++) {
                        axios.get(`https://api.themoviedb.org/3/movie/${movies[i].id}/credits`, {
                            params: {
                                api_key: this.mykey
                            }
                        })
                        .then(response => {
                            let cast = response.data.cast;
                            cast.length = 5;
    
                            this.showsList.push({
                                ...movies[i],
                                cast: this.getCastName(cast)
                            })
                            // console.log(response.data.cast);
                        });
                    }
                    for(let i = 0; i < tvShows.length; i++) {
                        axios.get(`https://api.themoviedb.org/3/tv/${tvShows[i].id}/credits`, {
                            params: {
                                api_key: this.mykey
                            }
                        })
                        .then(response => {
                            let cast = response.data.cast;
                            cast.length = 5;
    
                            this.showsList.push({
                                ...tvShows[i],
                                cast: this.getCastName(cast)
                            })
                            // console.log(response.data.cast);
                        });
                    }
                    this.filteredShowList = this.showsList.sort(function(a, b){
                        return a.popularity - b.popularity;
                    });
                    this.search = '';
                    }));
            }
        },
        reset() {
            this.showsList = [];
        },
    }
});