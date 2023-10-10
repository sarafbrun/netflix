const API_KEY = '4287ad07'

export const searchMovies = async ({ search }) => {
    if (search === '') return null

    try {
        const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${search}`)
        const json = await response.json()

        const movies = json.Search;

        // Este codigo puede sacarse de aqui, y si cambian nuestros datos podemos cambiarlos unicamente aqui, no habria que ir cambiandolos en todos los componentes donde se utilizan los datos directos de la API.
        return movies?.map(movie => ({
            id: movie.imdbIDiD,
            title: movie.Title,
            year: movie.Year,
            poster: movie.Poster
        }))
    } catch (e) {
        throw new Error('Error searching movies')
    }

}