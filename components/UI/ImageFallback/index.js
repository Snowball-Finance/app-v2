import { useState } from 'react';
import Image from 'next/image';
import { NO_IMAGE_PATH } from 'utils/constants/image-paths';

const ImageFallback = props => {
  const { src, fallbackSrc = NO_IMAGE_PATH, width = 50, height = 50, ...rest } = props;
  const [showFallback, setShowFallback] = useState(false);
  const [oldSrc, setOldSrc] = useState(src);
  if (oldSrc !== src) {
    setShowFallback(false);
    setOldSrc(src);
  }
  return (
    <Image
      {...rest}
      width={width}
      height={height}
      src={showFallback ? fallbackSrc : src}
      onError={() => {
        setShowFallback(true);
      }}
    />
  );
};

export default ImageFallback;
