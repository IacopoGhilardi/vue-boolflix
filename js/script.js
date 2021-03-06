const app = new Vue({

    el: "#root",
    data: {
        imgPath: 'https://image.tmdb.org/t/p/w220_and_h330_face/',
        search:'',
        genreList: [],
        showsList: [],
        movies: [],
        tvShows: [],
        filteredShowList: [],
        mykey: '63d036c152cd4651d8a116600d977c32',
        select: '',
        hover: false
    },
    mounted(){
        //richiamo le api per avere le opzioni della selection dei generi
        Promise.all([
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
        .then((response) => {
            //salvo i risultati nell'array dei generi
            const movieGenreList = response[0].data.genres;
            const showsGenreList = response[1].data.genres;
            
            movieGenreList.forEach(element => {
                showsGenreList.forEach((item, index) => {
                    if (element.id == item.id) {
                        showsGenreList.splice(index, 1);
                    }
                });
            });
            this.genreList = movieGenreList.concat(showsGenreList);
        });
    },
    methods: {
        //gestione della bandiera
        flagImg(movie) {
            if (movie.original_language == "it" || movie.original_language == "en" || movie.original_language == "es") {
                return ("img/" + movie.original_language.toLowerCase() + ".png");
            } else return false;
        },
        //gestisco il voto
        movieRate(movie) {
            return Math.ceil(movie.vote_average / 2);
        },
        // vedo se l'elemento è l'ultimo dell'array
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
        // filtro per genere
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
                if (cast.length < 5) {
                    cast.push(element.name);
                } else return cast;
            });
            return cast;
        },
        //stampo il cast di un array
        printCast(show, array){
            const copyArr = []
            for(let i = 0; i < array.length; i++) {
                axios.get(`https://api.themoviedb.org/3/${show}/${array[i].id}/credits`, {
                    params: {
                        api_key: this.mykey
                    }
                })
                .then(response => {
                    let cast = response.data.cast;

                    this.showsList.push({
                        ...array[i],
                        cast: this.getCastName(cast)
                    });
                    copyArr.push({
                        ...array[i],
                        cast: this.getCastName(cast)
                    });
                    this.$forceUpdate();
                });
            }
            if (show == 'tv') {
                this.tvShows = copyArr;
            } else this.movies = copyArr;
        },
        //funzione search
        searchMovie(){
            if (this.search != '') {
                this.reset();
                Promise.all([
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
                .then((response) => {
                    //salvo i risultati nell'array movies
                    this.movies = response[0].data.results;
                    this.tvShows = response[1].data.results;

                    //cast di film e serie
                    this.printCast('movie', this.movies);                    
                    this.printCast('tv', this.tvShows);

                    this.filteredShowList = this.showsList;

                    this.search = '';
                    });
            }
        },
        //stampo film popolari
        getPopularMovies() {
            this.select = '';
            if(this.movies.length == 0){
                this.reset();
                axios.get('https://api.themoviedb.org/3/movie/popular',
                        {
                            params: {
                                api_key: this.mykey,
                                language: 'it-IT'
                            }
                        })
                        .then(response => {
                            this.filteredShowList = response.data.results;
                            this.printCast('movie', this.filteredShowList);
                            this.filteredShowList = this.showsList;
                        });
            } else {
                this.filteredShowList = this.movies;
            }
        },
        //stampo serie tv popolari
        getPopularTvshow() {     
            this.select = '';    
            if(this.tvShows.length == 0){
                this.reset();
                axios.get('https://api.themoviedb.org/3/tv/popular',
                {
                    params: {
                        api_key: this.mykey,
                        language: 'it-IT'
                    }
                })
                .then(response => {
                    this.filteredShowList = response.data.results;
                    this.printCast('tv', this.filteredShowList);
                    this.filteredShowList = this.showsList;
                });
            } else {
                this.filteredShowList = this.tvShows;
            }
        },
        //stampo tutti gli show popolari
        getPopularFromAllShows(){
            this.reset();
                Promise.all([
                    //chiamata API movie
                    axios.get('https://api.themoviedb.org/3/movie/popular',
                    {
                        params: {
                            api_key: this.mykey,
                            language: 'it-IT'
                        }
                    }),
                    //chiamata API serie
                    axios.get('https://api.themoviedb.org/3/tv/popular',
                    {
                        params: {
                            api_key: this.mykey,
                            language: 'it-IT'
                        }
                    })
                ])
                .then((response) => {
                    //salvo i risultati nell'array movies
                    const popularMovies = response[0].data.results;
                    const popularTvShows = response[1].data.results;

                    //cast
                    this.printCast('movie', popularMovies);
                    this.printCast('tv', popularTvShows);

                    this.filteredShowList = this.showsList;
                });
        },
        //funzione reset
        reset() {
            this.showsList = [];
            this.filteredShowList = [];
            this.movies = [];
            this.tvShows = [];
            this.select = '';
        }
    }
});