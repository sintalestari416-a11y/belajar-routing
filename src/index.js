import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, useParams, useSearchParams } from 'react-router-dom';

// --- 1. DATA (Mock Data & Utility Functions) ---
const movies = [
  { id: 1, title: 'The Waterfall Journal', overview: 'Petualangan mencari curug tersembunyi di Garut.' },
  { id: 2, title: 'Sanghyang Taraje', overview: 'Kisah legenda air terjun kembar yang megah.' },
  { id: 3, title: 'React Master', overview: 'Perjalanan seorang mahasiswa menjadi Full-stack developer.' },
];

function getAllMovies() {
  return movies;
}

function getMovie(id) {
  return movies.find((movie) => movie.id === id);
}

function searchMovies(keyword) {
  if (!keyword) return [];
  return movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword.toLowerCase())
  );
}

// --- 2. KOMPONEN UI PENDUKUNG ---

// Komponen Kotak Pencarian
class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { keyword: props.defaultKeyword || '' };
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.onKeywordChangeHandler = this.onKeywordChangeHandler.bind(this);
  }

  onKeywordChangeHandler(event) {
    this.setState({ keyword: event.target.value });
  }

  onSubmitHandler(event) {
    event.preventDefault();
    this.props.search(this.state.keyword);
  }

  render() {
    return (
      <form onSubmit={this.onSubmitHandler} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Cari judul film..."
          value={this.state.keyword}
          onChange={this.onKeywordChangeHandler}
        />
        <button type="submit">Cari</button>
      </form>
    );
  }
}

// --- 3. KOMPONEN HALAMAN (PAGES) ---

// Halaman Utama: Daftar Semua Film
function HomePage() {
  const movies = getAllMovies();
  return (
    <div>
      <h2>Katalog Film</h2>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id} style={{ marginBottom: '10px' }}>
            <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Halaman Pencarian (Wrapper + Class)
function SearchPageWrapper() {
  const [searchParams, setSearchParams] = useSearchParams();
  const title = searchParams.get('title');

  function changeSearchParams(keyword) {
    setSearchParams({ title: keyword });
  }

  return <SearchPage onSearch={changeSearchParams} activeKeyword={title} />;
}

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      foundMovies: props.activeKeyword ? searchMovies(props.activeKeyword) : []
    };
    this.onSearchHandler = this.onSearchHandler.bind(this);
  }

  onSearchHandler(keyword) {
    this.setState({ foundMovies: searchMovies(keyword) });
    this.props.onSearch(keyword);
  }

  render() {
    return (
      <section>
        <h2>Cari Film</h2>
        <SearchBar search={this.onSearchHandler} defaultKeyword={this.props.activeKeyword} />
        {this.state.foundMovies.length > 0 ? (
          <ul>
            {this.state.foundMovies.map((movie) => (
              <li key={movie.id}>
                <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>Silakan ketik judul film (misal: "Waterfall")</p>
        )}
      </section>
    );
  }
}

// Halaman Detail (Wrapper + Class)
function DetailPageWrapper() {
  const { id } = useParams();
  return <DetailPage id={Number(id)} />;
}

class DetailPage extends React.Component {
  render() {
    const movie = getMovie(this.props.id);
    if (!movie) return <p>Film tidak ditemukan!</p>;

    return (
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <h2>{movie.title}</h2>
        <p><strong>Deskripsi:</strong> {movie.overview}</p>
        <Link to="/">← Kembali ke Home</Link>
      </div>
    );
  }
}

// --- 4. UTAMA APLIKASI ---
function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <header>
        <h1>🎬 Movie Catalogue</h1>
        <nav>
          <Link to="/">Home</Link> | <Link to="/search">Cari Film</Link>
        </nav>
      </header>
      <hr />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPageWrapper />} />
          <Route path="/movies/:id" element={<DetailPageWrapper />} />
        </Routes>
      </main>
    </div>
  );
}

// --- 5. RENDER ---
const root = createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);