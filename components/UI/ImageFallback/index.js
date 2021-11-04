import { useState } from 'react';
import Image from 'next/image';
import { NO_IMAGE_PATH } from 'utils/constants/image-paths';

const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333"/>
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = str => (typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str));

const keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

const triplet = (e1, e2, e3) =>
  keyStr.charAt(e1 >> 2) +
  keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
  keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
  keyStr.charAt(e3 & 63);

const rgbDataURL = (r, g, b) =>
  `data:image/gif;base64,R0lGODlhAQABAPAA${
    triplet(0, r, g) + triplet(b, 255, 255)
  }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;

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
      // placeholder='blur'
      // blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(width || 50, height || 50))}`}
      // blurDataURL={rgbDataURL(237, 181, 6)}
      // blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAIQAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMAFA4PEg8NFBIQEhcVFBgeMiEeHBwePSwuJDJJQExLR0BGRVBac2JQVW1WRUZkiGVtd3uBgoFOYI2XjH2Wc36BfP/bAEMBFRcXHhoeOyEhO3xTRlN8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fP/AABEIADsAOwMBIgACEQEDEQH/xAAZAAADAQEBAAAAAAAAAAAAAAABAgMEAAX/xAAbEAEBAQEBAQEBAAAAAAAAAAAAAQIDEhETMf/EABgBAQEBAQEAAAAAAAAAAAAAAAIDAQAE/8QAFhEBAQEAAAAAAAAAAAAAAAAAAAER/9oADAMBAAIRAxEAPwD0ZD5g+TSPWjpsmdIeRrE7EtRp8luGWukY9ZJ5rXeYfkGmfyMhhkNLXSHzkMxXMG0oEy7wrIPwLTxC4D817A+DrmT6MSmlM1a1LFcxbMSwvmJWqQZHUSa0JOtL6S3sn6OYyyrYrPF+Zi1c18oc18jSg3+IdKtpn6i1m6bS9j1RKBX/2Q=='
      // blurDataURL={`data:image/svg+xml;base64,${toBase64(convertImage(size || 50, size || 50))}`}
      // loading='lazy'
      src={showFallback ? fallbackSrc : src}
      onError={() => {
        setShowFallback(true);
      }}
    />
  );
};

export default ImageFallback;
