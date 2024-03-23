import React, { useState, useEffect, useCallback } from 'react';
import { Searchbar } from './SearchBar/SearchBar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import { Api } from './Api';
import { Empty } from './Empty';
import styles from './App.module.css';

const App = () => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [total, setTotal] = useState(13);
  const [current, setCurrent] = useState(null);
  const [shouldFetchImages, setShouldFetchImages] = useState(false);

  const fetchImages = useCallback(() => {
    setIsLoading(true);
    Api.fetchImages(query, page)
      .then(res => {
        setImages(prevImages => [...prevImages, ...res.data.hits]);
        setTotal(res.data.total);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [page, query]);

  useEffect(() => {
    if (shouldFetchImages) {
      fetchImages();
    }
  }, [fetchImages, shouldFetchImages]);

  const isDisabled = () => {
    return page >= Math.ceil(total / 12);
  };

  const onSubmit = query => {
    setQuery(query);
    setPage(1);
    setImages([]);
    setShouldFetchImages(true); // Enable image fetching after submitting query
  };

  const handleClickImage = image => {
    setCurrent(image);
  };

  const handleCloseModal = () => {
    setCurrent(null);
  };

  const hasImages = images.length > 0;
  const hasLoading = isLoading && !hasImages;

  return (
    <div className={styles.App}>
      <Searchbar onSubmit={onSubmit} />
      {hasImages ? (
        <ImageGallery onClickImage={handleClickImage} images={images} />
      ) : (
        <Empty />
      )}
      {hasLoading && <Loader />}
      {hasImages && (
        <Button disabled={isDisabled()} onClick={() => setPage(page + 1)} />
      )}

      {current && <Modal onClose={handleCloseModal} image={current} />}
    </div>
  );
};

export default App;
