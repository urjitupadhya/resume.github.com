import React from 'react'
import { pdf } from "pdf-to-img";
import { useEffect, useState } from 'react';


const Resume = ({file}: {file: File}) => {
    const [image, setImage] = useState<string | null>(null);
    
   useEffect(() => {
      const processFile = async () => {
        try {
          const buffer = await file.arrayBuffer();
          const document = await pdf(new Uint8Array(buffer), { scale: 3 });
          const firstPageImage = await document.getPage(1);
          
          if (firstPageImage) {
            const blob = new Blob([firstPageImage], { type: 'image/png' });
            const imageUrl = URL.createObjectURL(blob);
            setImage(imageUrl);
          }
        } catch (error) {
          console.error("Error processing PDF:", error);
        }
      };
      
      if (file) {
        processFile();
      }
      
      // Clean up function
      return () => {
        if (image) {
          URL.revokeObjectURL(image);
        }
      };
    }, [file]);
  return (
    <div>
        {image && <img src={image} alt="Resume" />}
    </div>
  )
}

export default Resume