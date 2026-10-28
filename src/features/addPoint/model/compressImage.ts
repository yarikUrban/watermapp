const MAX_IMAGE_DIMENSION = 1920;
const TARGET_IMAGE_SIZE = 900 * 1024;
const WEBP_QUALITY_STEPS = [0.82, 0.72, 0.62, 0.52];

function canvasToWebp(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", quality);
  });
}

/** Compresses oversized images in the browser while keeping small files intact. */
export async function compressImage(file: File): Promise<File> {
  if (typeof createImageBitmap === "undefined") {
    return file;
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  try {
    if (
      file.size <= TARGET_IMAGE_SIZE &&
      Math.max(bitmap.width, bitmap.height) <= MAX_IMAGE_DIMENSION
    ) {
      return file;
    }

    const initialScale = Math.min(
      1,
      MAX_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height),
    );
    let scale = initialScale;

    for (let resizeAttempt = 0; resizeAttempt < 5; resizeAttempt += 1) {
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));

      const context = canvas.getContext("2d");
      if (!context) return file;
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

      let smallestBlob: Blob | null = null;
      for (const quality of WEBP_QUALITY_STEPS) {
        const blob = await canvasToWebp(canvas, quality);
        if (!blob) continue;
        if (!smallestBlob || blob.size < smallestBlob.size) smallestBlob = blob;
        if (blob.size <= TARGET_IMAGE_SIZE) break;
      }

      if (!smallestBlob) return file;
      if (smallestBlob.size <= TARGET_IMAGE_SIZE || resizeAttempt === 4) {
        const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
        return new File([smallestBlob], `${baseName}.webp`, {
          type: "image/webp",
          lastModified: file.lastModified,
        });
      }

      const sizeScale = Math.sqrt(TARGET_IMAGE_SIZE / smallestBlob.size);
      scale *= Math.min(0.85, Math.max(0.5, sizeScale * 0.9));
    }

    return file;
  } finally {
    bitmap.close();
  }
}
