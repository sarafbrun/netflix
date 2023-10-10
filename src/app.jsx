import './app.css';
import { useRef, useState, useEffect, useCallback } from 'react';
// USEREF: Permite crear una ref mutable que persiste (su valor no se reinicia) durante el ciclo de vida de tu componente, util para guardar cualquier elemento como un contador, un elemento del dom etc, cada vez que cambia no renderiza el componente. EL USESTATE cuando cambia su valor renderiza el componente
import { useMovies } from './hooks/useMovies';
import { Movies } from './components/Movies';
import debounce from "just-debounce-it";


function useSearch() {
  const [search, updateSearch] = useState('');
  const [error, setError] = useState(null);
  const isFirstInput = useRef(true) //si el usuario ha usado el input para que valide cuando lo haya usado, y no antes

  useEffect(() => {
    if (isFirstInput.current) {
      isFirstInput.current = search === ''
      return
    }

    if (search === '') {
      setError('No se puede buscar una película vacía')
      return
    }

    if (search.match(/^\d+$/)) {
      setError('No se puede buscar una película con un número')
      return
    }

    if (search.length < 3) {
      setError('La búsqueda debe tener al menos 3 caracteres')
      return
    }

    setError(null)
  }, [search])

  return { search, updateSearch, error }

}



export function App() {
  const [sort, setSort] = useState(false);

  const { search, updateSearch, error } = useSearch();
  const { movies, loading, getMovies } = useMovies({ search, sort })


  const debouncedGetMovies = useCallback(
    debounce(search => {
      getMovies({ search })
    }, 500)
    , [getMovies]
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    getMovies({ search })
  }

  const handleSort = () => {
    setSort(!sort);
  }

  const handleChange = (event) => {
    const newSearch = event.target.value //cada vez que detecta un cambio en el input hara la busqueda de getMovies
    updateSearch(newSearch)
    debouncedGetMovies(newSearch)
  }



  return (
    <div className='page'>
      <header>
        <h1>Buscador de películas</h1>
        <form className='form' onSubmit={handleSubmit}>
          <input
            style={{
              border: '1px solid transparent',
              borderColor: error ? 'red' : 'transparent'
            }}
            onChange={handleChange}
            value={search}
            name='query'
            placeholder='Avengers, Stars Wars, The Matrix...' />
          <input type='checkbox' onChange={handleSort} checked={sort} />
          <button type='submit'>Buscar</button>
        </form>
        {error && <p style={{ color: 'red' }} className='error'>{error}</p>}
      </header>

      <main>
        {
          loading ? <p>Cargango...</p> : <Movies movies={movies} />
        }

      </main>
    </div >
  );
}

export default App
