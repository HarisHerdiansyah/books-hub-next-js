'use client';

import { useState, Dispatch, SetStateAction, useRef } from 'react';
import { PixelCrop } from 'react-image-crop';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Cropper from './Cropper';

type Props = {
  imgSrc: string;
  imgFile: File;
  open: boolean;
  setImgSrc: Dispatch<SetStateAction<string | null>>;
  setImgFile: Dispatch<SetStateAction<File | null | undefined>>;
  onClose: () => void;
};

export default function CropPhotoDialog({
  imgSrc,
  imgFile,
  open,
  setImgSrc,
  setImgFile,
  onClose,
}: Props) {
  const [pixelCrop, setPixelCrop] = useState<PixelCrop>();
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onConfirmCrop = () => {
    const image = imageRef.current;
    const canvas = canvasRef.current;
    if (!image || !canvas) throw new Error('No image or canvas');

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No 2d context');

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const pixelRatio = window.devicePixelRatio;
    if (!pixelCrop) throw new Error('Photo is not selected');

    canvas.width = Math.floor(pixelCrop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(pixelCrop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = 'high';

    const cropX = pixelCrop.x * scaleX;
    const cropY = pixelCrop.y * scaleY;

    const centerX = image.naturalWidth / 2;
    const centerY = image.naturalHeight / 2;

    ctx.translate(-cropX, -cropY);
    ctx.translate(centerX, centerY);
    ctx.translate(-centerX, -centerY);
    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight
    );

    canvas.toBlob((blob) => {
      const ext = imgFile.name.split('.').pop();
      if (blob) {
        const file = new File([blob], `profile.${ext}`, {
          type: imgFile.type,
        });
        setImgFile(file);
      }
    });
    setImgSrc(canvas.toDataURL(imgFile.type));
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Customize your photo</DialogTitle>
        </DialogHeader>
        <Cropper
          imgSrc={imgSrc}
          onComplete={setPixelCrop}
          imgRef={imageRef}
          canvasRef={canvasRef}
        />
        <DialogFooter>
          <Button variant='purple' onClick={onConfirmCrop}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
