import React, { useState } from "react";
import { Box, ImageList, ImageListItem } from "@mui/material";

const Roomimage = ({ images }) => {
  const [mainImage, setMainImage] = useState(images[0]);

  const handleImageClick = (image) => {
    setMainImage(image);
  };

  return (
    <Box display="flex" alignItems="center">
      {/* Secondary images */}
      <Box 
        sx={{ 
          maxHeight: "400px", 
          overflowY: "auto", 
          marginRight: "20px" 
        }}
      >
        <ImageList cols={1} gap={10} sx={{ width: 30 }}>
          {images.map((image, index) => (
            <ImageListItem key={index}>
              <img
                src={image}
                alt={`Room ${index}`}
                width={30}
                height={30}
                style={{ cursor: "pointer" }}
                onClick={() => handleImageClick(image)}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>

      {/* Main image */}
      <Box 
        sx={{ 
          flex: 1, 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center" 
        }}
      >
        <img 
          src={mainImage} 
          alt="Main Room" 
          style={{ 
            width: "400px", 
            height: "400px", 
            objectFit: "cover", 
            borderRadius: "8px" 
          }} 
        />
      </Box>
    </Box>
  );
};

export default Roomimage;
