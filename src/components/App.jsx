import { Component } from 'react';
import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import * as Scroll from 'react-scroll';
import { Searchbar } from './Searchbar/Seachbar';
import { Loader } from './Loader/Loader';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';

const API_KEY = '34728091-aad7c1a347ba4d65085b0c300';
const BASE_URL = 'https://pixabay.com/api/?';
const searchParams = 'image_type=photo&orientation=horizontal&per_page=12';
const scroll = Scroll.animateScroll;

export class App extends Component {
  state = {
    searchQuery: '',
    images: [],
    page: 1,
    isLoading: false,
    per_page: 12,
  };

  handleSubmit = async query => {
    if (query === this.state.searchQuery) {
      return;
    }
    const searchUrl = `${BASE_URL}q=${query}&page=1&key=${API_KEY}&${searchParams}`;
    try {
      this.setState({ isLoading: true });
      scroll.scrollToTop();
      const response = await axios.get(searchUrl);
      if (response.data.hits.length === 0) {
        iziToast.warning({
          message: 'We are sorry, but you have reached the end of search results.',
          messageColor: 'white',
          backgroundColor: 'lightred',
          timeout: 3000,
          position: 'topLeft',
        });
        return;
      }
      this.setState({
        searchQuery: query,
        images: response.data.hits,
        page: 1,
      });
    } catch (error) {
      iziToast.warning({
        message: 'Sorry, there are no images matching your search query. Please try again.',
        messageColor: 'white',
        backgroundColor: 'lightred',
        timeout: 3000,
        position: 'topLeft',
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleClick = async () => {
    const { searchQuery, page } = this.state;
    const searchUrl = `${BASE_URL}q=${searchQuery}&page=${page + 1}&key=${API_KEY}&${searchParams}`;
    try {
      this.setState({ isLoading: true });
      const response = await axios.get(searchUrl);
      scroll.scrollMore(500);
      if (response.data.hits.length === 0) {
        iziToast.warning({
          message: 'We are sorry, but you have reached the end of search results.',
          messageColor: 'white',
          backgroundColor: 'lightred',
          timeout: 3000,
          position: 'bottomLeft',
        });
        return;
      }
      this.setState(prevState => ({
        images: [...prevState.images, ...response.data.hits],
        page: prevState.page + 1,
      }));
    } catch (error) {
      iziToast.warning({
        message: 'Something went wrong. Please try again.',
        messageColor: 'white',
        backgroundColor: 'lightred',
        timeout: 3000,
        position: 'topLeft',
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { isLoading, images } = this.state;
    return (
      <>
        <Searchbar onSubmit={this.handleSubmit} />
        {isLoading && <Loader />}
        <ImageGallery images={images} />
        {images.length !== 0 && <Button handleClick={this.handleClick} />}
      </>
    );
  }
}
