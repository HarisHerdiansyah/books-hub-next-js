'use client';

import Image from 'next/image';
import { Dispatch, RefObject, SetStateAction, useState } from 'react';
import ReactCrop, {
  type Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from 'react-image-crop';

type Props = {
  imgSrc: string;
  onComplete: Dispatch<SetStateAction<PixelCrop | undefined>>;
  imgRef: RefObject<HTMLImageElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
};

export default function Cropper({
  imgSrc,
  onComplete,
  imgRef,
  canvasRef,
}: Props) {
  const [crop, setCrop] = useState<Crop>();

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const centerAspectCrop = centerCrop(
      makeAspectCrop({ unit: '%', width: 90, height: 90 }, 1, width, height),
      width,
      height
    );
    setCrop(centerAspectCrop);
  };

  return (
    <>
      <ReactCrop
        crop={crop}
        onChange={(_, percentCrop) => setCrop(percentCrop)}
        onComplete={onComplete}
        aspect={1}
        circularCrop
      >
        <Image
          src={imgSrc}
          alt='Preview'
          width={500}
          height={500}
          onLoad={onImageLoad}
          ref={imgRef}
        />
      </ReactCrop>
      <canvas ref={canvasRef} className='hidden' />
    </>
  );
}
