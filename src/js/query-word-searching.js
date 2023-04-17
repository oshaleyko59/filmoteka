import { genres } from './genres.js';
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { pagination } from './pagination.js';
import { getTemplateCard } from './template-card.js';
import { api } from './API.js';

const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const DEFAULT_POSTER_URL =
  'https://motivatevalmorgan.com/wp-content/uploads/2016/06/default-movie.jpg';
const galleryEl = document.querySelector('.film__gallery');
const filmSearchForm = document.querySelector('.search-bar');

filmSearchForm.addEventListener('submit', handleFormSubmit);
export async function handleFormSubmit(event) {
  event.preventDefault();
  const query = event.currentTarget.search.value.trim();
  if (query === '') {
    Notify.failure('Please enter a search query for the movie');
    return;
  }

  try {
    const movies = await api.fetchMovie(1, query);
    if (movies.total_results === 0) {
      Notify.failure('No movies found with the given search query.');
      renderMoviesMarkup(null);
      return;
    }
    renderMoviesMarkup(movies);
  } catch (error) {
    console.log(error);
  } finally {
    filmSearchForm.reset();
  }
}

export function renderMoviesMarkup(response) {
  if (response === null) {
    galleryEl.innerHTML = '';
    return;
  }
  const markup = response.results
    .map(({ poster_path, title, genre_ids, id, release_date }) => {
      const date = release_date
        ? release_date.split('').splice(0, 4).join('')
        : 'Unknown';
      const posterUrl = poster_path
        ? `${IMG_URL}${poster_path}`
        : DEFAULT_POSTER_URL;
      return `  
        <li class="film__item">    
            <div class="film-card__img">   
              <img src="${posterUrl}" alt="${title}" loading="lazy" data-id="${id}"/>   
            </div>   
            <div class="film__info">   
              <p class="film__name">${title}</p>   
              <p class="film__ganres">${genres.getSome(
                genre_ids
              )} | ${date}</p>   
            </div>  
        </li>`;
    })
    .join('');
  galleryEl.innerHTML = markup;
}
