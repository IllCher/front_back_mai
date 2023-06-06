import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './App.css';

function App() {
  const [kittenImages, setKittenImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

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

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
    setUploading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      await axios.post('http://localhost:5000/api/upload', formData);
      fetchKittenImages();
      setSelectedImage(null);
    } catch (error) {
      console.error('Error uploading kitten image:', error);
    } finally {
      setUploading(false);
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

  const handleDownloadImage = (imageUrl) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'kitten.jpg';
    link.click();
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="app">
      <h1>Kitten Carousel</h1>
      <div className="carousel-container">
        <Carousel showThumbs={false} infiniteLoop autoPlay interval={3000} style={{ height: '80vh' }}>
          {kittenImages.map((image, index) => (
            <div key={index} className="carousel-item">
              <img src={image} alt={`Kitten ${index + 1}`} />
              <button className="custom-button download-button" onClick={() => handleDownloadImage(image)}>
                Download
              </button>
            </div>
          ))}
        </Carousel>
      </div>
      <div className="upload-container">
        <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} className="file-input" />
        <button className="custom-button" onClick={handleButtonClick}>
          Choose File
        </button>
        <button className="custom-button" onClick={handleRandomImageClick}>
          Random Kitten
        </button>
        {uploading && <p>Uploading...</p>}
      </div>
    </div>
  );
}

export default App;
