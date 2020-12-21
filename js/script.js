const app = new Vue({

    el: "#root",
    data: {
        imgPath: 'https://image.tmdb.org/t/p/w220_and_h330_face/',
        search:'',
        movies: []
    },
    methods: {
        //funzione search
        searchMovie(){
            //chiamata API
            axios.get('https://api.themoviedb.org/3/search/movie',
            {
                params: {
                    api_key: '63d036c152cd4651d8a116600d977c32',
                    query: this.search,
                    language: 'it-IT'
                }
            })
            .then((response) => {
                //salvo i risultati nell'array movies
                this.movies = response.data.results;
            });
            this.search = '';
        },
        reset() {
            this.movies = [];
        }
    }
});