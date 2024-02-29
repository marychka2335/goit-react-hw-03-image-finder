import { ImageGalleryItem } from '../ImageGalleryItem/ImageGalleryItem';
import { Modal } from '../Modal/Modal';
import css from './ImageGallery.module.css';
import { Component } from 'react';

export class ImageGallery extends Component {
  state = {
    largeImage: '',
    title: '',
    isOpen: false,
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = evt => {
    if (evt.code === 'Escape') {
      this.setState({
        isOpen: false,
      });
    }
  };
  handleClickImage = evt => {
    this.setState({
      largeImage: evt.target.dataset.image,
      title: evt.target.alt,
      isOpen: true,
    });
  };

  handleClickBackdrop = evt => {
    if (evt.currentTarget === evt.target) {
      this.setState({
        isOpen: false,
      });
    }
  };

  render() {
    const { largeImage, title, isOpen } = this.state;
    return (
      <ul className={css.imageGallery}>
        {this.props.images.map(({ id, webformatURL, largeImageURL, tags }) => {
          return (
            <ImageGalleryItem
              key={id}
              webFormat={webformatURL}
              largeFormat={largeImageURL}
              tags={tags}
              handleClick={this.handleClickImage}
            />
          );
        })}
        {isOpen && (
          <Modal largeImageURL={largeImage} title={title} onClick={this.handleClickBackdrop} />
        )}
      </ul>
    );
  }
}
