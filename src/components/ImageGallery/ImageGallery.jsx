import PropTypes from 'prop-types';
import { ImageGalleryItem } from './../ImageGalleryItem/ImageGalleryItem';
import css from './ImageGallery.module.css';

export const ImageGallery = ({ items, openModal }) => {
  return (
    <ul className={css.imageGallery}>
      {items.map(item => (
        <ImageGalleryItem key={item.id} itemData={item} openModal={openModal} />
      ))}
    </ul>
  );
};

ImageGallery.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape).isRequired,
  openModal: PropTypes.func.isRequired,
};
