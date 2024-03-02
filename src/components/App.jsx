import { Component } from 'react';
import { fetchGallery } from './API/Api';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
// import * as Scroll from 'react-scroll';
import { Searchbar } from './Searchbar/Seachbar';
import { Loader } from './Loader/Loader';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';
import css from './App.module.css';

export class App extends Component {
  state = {
    images: [],
    searchQuery: '',
    page: 1,
    isLoading: false,
    error: null,
    foundImages: null,
    currentLargeImg: null,
  };

  setInitialParams = searchQuery => {
    if (searchQuery === '') {
      return iziToast.warning({
        message: 'Enter your search parameters',
        messageColor: 'white',
        backgroundColor: 'lightred',
        timeout: 3000,
        position: 'topLeft',
      });
    }

    if (searchQuery === this.state.searchQuery) {
      return;
    }

    this.setState({
      images: [],
      searchQuery,
      page: 1,
    });
  };

  loadMore = () => {
    this.setState(({ page }) => ({ page: page + 1 }));
  };

  addImages = async (searchQuery, page) => {
    this.setState({ isLoading: true });

    try {
      const data = await fetchGallery(searchQuery, page);
      const { hits: newImages, totalHits: foundImages } = data;

      this.setState(oldState => ({
        images: [...oldState.images, ...newImages],
      }));

      if (foundImages !== this.state.foundImages) {
        this.setState({ foundImages });
      }

      if (data.hits.length === 0) {
        iziToast.warning({
          message: 'Sorry, there are no images matching your search query. Please try again.',
          messageColor: 'white',
          backgroundColor: 'lightred',
          timeout: 3000,
          position: 'topLeft',
        });
      }
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  openModal = (src, alt) => {
    this.setState(state => ({ ...state, currentLargeImg: { src, alt } }));
  };

  closeModal = () => {
    this.setState({ currentLargeImg: null });
  };

  componentDidUpdate(_, prevState) {
    if (prevState.page !== this.state.page || prevState.searchQuery !== this.state.searchQuery) {
      const { searchQuery, page } = this.state;
      this.addImages(searchQuery, page);
    }
  }

  render() {
    const { images, isLoading, error, foundImages, currentLargeImg } = this.state;

    return (
      <div className={css.app}>
        <Searchbar onSubmit={this.setInitialParams} />
        {error && <p>Whoops, something went wrong: {error.message}</p>}
        {isLoading && <Loader />}
        {images.length > 0 && (
          <>
            <ImageGallery items={images} openModal={this.openModal} />
            {images.length < foundImages && <Button loadMore={this.loadMore} />}
          </>
        )}
        {currentLargeImg && <Modal closeModal={this.closeModal} imgData={currentLargeImg} />}
      </div>
    );
  }
}

export default App;
