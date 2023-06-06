import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './App.css';

function App() {
  const [kittenImages, setKittenImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [brightness, setBrightness] = useState(100);
  const [opacity, setOpacity] = useState(100);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    fetchKittenImages();
  }, []);

  const fetchKittenImages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/images');
      setKittenImages(response.data);
    } catch (error) {
      console.error('Error fetching kitten images:', error);
    }
  };

  const handleRandomImageClick = async () => {
    try {
      const response = await axios.get('https://api.thecatapi.com/v1/images/search');
      const imageUrl = response.data[0].url;
      const newKittenImages = [...kittenImages, imageUrl];
      setKittenImages(newKittenImages);
      setSelectedImage(imageUrl);
    } catch (error) {
      console.error('Error fetching random kitten image:', error);
    }
  };

  const handleDownloadImage = async () => {
    if (selectedImage) {
      try {
        const response = await axios.get(`http://localhost:5000/api/download?url=${encodeURIComponent(selectedImage)}`, {
          responseType: 'blob',
        });

        const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', 'kitten.jpg');
        link.click();
      } catch (error) {
        console.error('Error downloading kitten image:', error);
      }
    }
  };

  const handleImageSelect = (index) => {
    setSelectedImage(kittenImages[index]);
  };

  const handleBrightnessChange = (event) => {
    setBrightness(parseInt(event.target.value));
  };

  const handleOpacityChange = (event) => {
    setOpacity(parseInt(event.target.value));
  };

  const handleZoomChange = (event) => {
    setZoomLevel(parseFloat(event.target.value));
  };

  const getImageStyle = () => ({
    filter: `brightness(${brightness}%) opacity(${opacity}%)`,
  });

  const getCarouselItemStyle = (index) => {
    const isSelected = selectedImage === kittenImages[index];
    const transformValue = isSelected ? `scale(${zoomLevel})` : 'none';
    const zIndexValue = isSelected ? 1 : 0;
    return {
      transform: transformValue,
      zIndex: zIndexValue,
    };
  };

  return (
    <div className="app">
      <h1>Kitten Carousel</h1>
      <div className="carousel-container">
        <Carousel
          showThumbs={false}
          infiniteLoop
          autoPlay
          interval={10000}
          style={{ height: '80vh' }}
          selectedItem={kittenImages.indexOf(selectedImage)}
          onClickItem={handleImageSelect}
        >
          {kittenImages.map((image, index) => (
            <div key={index} className="carousel-item" style={getCarouselItemStyle(index)}>
              <img src={image} alt={`Kitten ${index + 1}`} style={getImageStyle()} />
            </div>
          ))}
        </Carousel>
      </div>
      <div className="button-container">
        <button className="custom-button download-button" onClick={handleDownloadImage}>
          Download
        </button>
        <button className="custom-button" onClick={handleRandomImageClick}>
          Random Kitten
        </button>
        <div className="slider-container">
          <label htmlFor="zoom-slider">Zoom:</label>
          <input
            type="range"
            id="zoom-slider"
            min="0.5"
            max="2"
            step="0.1"
            value={zoomLevel}
            onChange={handleZoomChange}
          />
        </div>
        <div className="slider-container">
          <label htmlFor="brightness-slider">Brightness:</label>
          <input
            type="range"
            id="brightness-slider"
            min="0"
            max="200"
            step="1"
            value={brightness}
            onChange={handleBrightnessChange}
          />
        </div>
        <div className="slider-container">
          <label htmlFor="opacity-slider">Opacity:</label>
          <input
            type="range"
            id="opacity-slider"
            min="0"
            max="100"
            step="1"
            value={opacity}
            onChange={handleOpacityChange}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
