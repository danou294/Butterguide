import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onUpload: (url: string) => void;
  currentUrl?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, currentUrl }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setIsUploading(true);
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
      const newUrl = URL.createObjectURL(file);
      setBlobUrl(newUrl);
      setTimeout(() => {
        onUpload(newUrl);
        setIsUploading(false);
      }, 500);
    }
  }, [onUpload, blobUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false
  });

  const clearImage = () => {
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      setBlobUrl(null);
    }
    onUpload('');
  };

  return (
    <div className="space-y-2">
      {currentUrl ? (
        <div className="relative">
          <img
            src={currentUrl}
            alt="Photo uploadée"
            className="w-full h-32 object-cover rounded-lg border"
          />
          <Button
            size="sm"
            variant="destructive"
            className="absolute top-2 right-2"
            onClick={clearImage}
          >
            <X size={16} />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          {isUploading ? (
            <p className="text-sm text-gray-600">Upload en cours...</p>
          ) : isDragActive ? (
            <p className="text-sm text-gray-600">Déposez l'image ici...</p>
          ) : (
            <p className="text-sm text-gray-600">
              Glissez une image ici ou cliquez pour sélectionner
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
