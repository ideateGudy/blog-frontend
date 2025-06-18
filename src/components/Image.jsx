import { Image as ImageKitImage } from "@imagekit/react";

const Image = ({ src, className, w, h, alt }) => {
  return (
    <ImageKitImage
      urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
      src={src}
      alt={alt}
      lqip={{
        active: true,
        quality: 20, // Adjust the quality of the low-quality image placeholder
      }}
      loading="lazy"
      transformation={[
        // {}, // Any other transformation you want to apply to the placeholder image
        {
          width: w, // Default width if not provided
          height: h, // Default height if not provided
          quality: 20,
        },
      ]}
      className={className}
      width={w}
      height={h}
    />
  );
};

export default Image;
