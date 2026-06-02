"use client";

import { useState, useEffect, useRef } from "react";

// Shows a product photo. If the photo file is missing or fails to load, it
// shows the given `fallback` (a tidy placeholder) instead of a broken image.
export default function ProductImage({ src, alt, imgClassName, fallback }) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef(null);

  // After the page loads, double-check the image actually appeared. If it
  // finished trying but has no width, it failed — so show the placeholder.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setFailed(true);
    }
  }, [src]);

  if (failed) {
    return fallback;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={imgClassName}
    />
  );
}
