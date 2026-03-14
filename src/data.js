const movies = [
  { id: 1, title: 'The Waterfall Journal', overview: 'Petualangan mencari curug tersembunyi di Garut.' },
  { id: 2, title: 'Sanghyang Taraje', overview: 'Kisah legenda air terjun kembar yang megah.' },
  { id: 3, title: 'React Master', overview: 'Perjalanan seorang mahasiswa menjadi Full-stack developer.' },
];

export function getAllMovies() {
  return movies;
}

export function getMovie(id) {
  return movies.find((movie) => movie.id === id);
}