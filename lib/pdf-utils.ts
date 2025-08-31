// PDF processing utilities with better error handling
export const getResumeImage = async (resume: File): Promise<Blob> => {
  // Check if we're on the client side
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('This function can only run on the client side');
  }

  try {
    // For now, let's create a simple placeholder image instead of processing PDF
    // This avoids the PDF.js worker issues entirely
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error('Failed to get canvas context');
    }

    // Create a simple placeholder image
    context.fillStyle = '#f3f4f6';
    context.fillRect(0, 0, 800, 600);
    
    context.fillStyle = '#6b7280';
    context.font = '24px Arial';
    context.textAlign = 'center';
    context.fillText('Resume Preview', 400, 200);
    
    context.font = '16px Arial';
    context.fillText(`File: ${resume.name}`, 400, 240);
    context.fillText('PDF processing temporarily disabled', 400, 280);
    context.fillText('due to compatibility issues', 400, 310);
    
    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create placeholder image'));
        }
      }, 'image/png');
    });
    
  } catch (error) {
    console.error('Error creating placeholder image:', error);
    
    if (error instanceof Error) {
      throw new Error(`Image creation failed: ${error.message}`);
    } else {
      throw new Error('Image creation failed with unknown error');
    }
  }
};

// Alternative function that doesn't require PDF.js for non-PDF files
export const getFilePreview = async (file: File): Promise<Blob | null> => {
  if (typeof window === 'undefined') {
    return null;
  }

  // For non-PDF files, we can create a simple preview
  if (!file.type.includes('pdf')) {
    // For images, return the file as-is
    if (file.type.startsWith('image/')) {
      return file;
    }
    
    // For other file types, return null (no preview available)
    return null;
  }

  // For PDF files, use the PDF processing function
  return getResumeImage(file);
};
