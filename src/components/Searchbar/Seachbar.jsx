import { Component } from 'react';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import css from './Searchbar.module.css';

export class Searchbar extends Component {
  handleSubmit = evt => {
    evt.preventDefault();
    const query = evt.target.elements.searchInput.value.toLowerCase().trim();
    if (query) {
      this.props.onSubmit(query);
    } else {
      iziToast.warning({
        message: 'Sorry, there are no images matching your search query. Please try again.',
        messageColor: 'white',
        backgroundColor: 'navy',
        timeout: 3000,
        position: 'topLeft',
      });
    }
  };
  render() {
    return (
      <header className={css.searchbar}>
        <form className={css.searchForm} onSubmit={this.handleSubmit}>
          <button type="submit" className={css.searchFormButton}>
            <span className={css.searchFormButtonLabel}>Search</span>
          </button>

          <input
            className={css.searchFormInput}
            name="searchInput"
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
          />
        </form>
      </header>
    );
  }
}
