// 63d036c152cd4651d8a116600d977c32
// https://image.tmdb.org/t/p/w220_and_h330_face/


const app = new Vue({

    el: "#root",
    data: {
        imgPath: 'https://image.tmdb.org/t/p/w220_and_h330_face/',
        search:'',
        movies: []
    },
    methods: {
        searchMovie(){
            console.log(this.search);
            axios.get('https://api.themoviedb.org/3/search/movie',
            {
                params: {
                    api_key: '63d036c152cd4651d8a116600d977c32',
                    query: this.search,
                    language: 'it-IT'
                }
            })
            .then((response) => {
                this.movies = response.data.results;
                console.log('movies', this.movies);
            })
        }
    }
});