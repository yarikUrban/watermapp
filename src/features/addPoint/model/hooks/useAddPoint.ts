import { useAuth } from "@/providers/AuthProvider";
import {
  createPoint,
  savePointRequestImages,
  uploadImage,
} from "@/features/addPoint/api/createPoint";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  useAddPointContext,
  type AddPointFormValues,
} from "../AddPointContext";
import { SUPPORTED_IMAGE_TYPES } from "../imageTypes";
import { compressImage } from "../compressImage";

export type AddPointNotification = {
  type: "success" | "error";
  message: string;
};

export const useAddPoint = () => {
  const { user } = useAuth();
  const router = useRouter();
  const {
    isAddingPoint,
    setIsAddingPoint,
    setIsSelectingLocation,
    values,
    images,
    setValues,
    setImages,
  } = useAddPointContext();
  const [isAuthPromptVisible, setIsAuthPromptVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<AddPointNotification | null>(
    null,
  );
  useEffect(() => {
    if (!notification) return;
    const timeout = window.setTimeout(() => setNotification(null), 4500);
    return () => window.clearTimeout(timeout);
  }, [notification]);

  const handleAddPoint = useCallback(() => {
    setError(null);
    if (user) {
      setIsSelectingLocation(false);
      setIsAddingPoint(true);
      return;
    }
    setIsAuthPromptVisible(true);
  }, [setIsAddingPoint, setIsSelectingLocation, user]);

  const handleChange = useCallback(
    (field: keyof AddPointFormValues, value: string | boolean) => {
      setValues((current) => ({ ...current, [field]: value }));
      setError(null);
    },
    [setValues],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!user || isSubmitting) return;

      const latitude = Number(values.latitude);
      const longitude = Number(values.longitude);
      if (
        !values.latitude.trim() ||
        !values.longitude.trim() ||
        !Number.isFinite(latitude) ||
        latitude < -90 ||
        latitude > 90
      ) {
        setError("Укажите корректную широту от -90 до 90.");
        return;
      }
      if (
        !values.longitude.trim() ||
        !Number.isFinite(longitude) ||
        longitude < -180 ||
        longitude > 180
      ) {
        setError("Укажите корректную долготу от -180 до 180.");
        return;
      }
      if (!values.title.trim()) {
        setError("Введите название точки.");
        return;
      }
      if (images.some(({ file }) => !SUPPORTED_IMAGE_TYPES.has(file.type))) {
        setError("Поддерживаются изображения PNG, JPG, JPEG, WEBP и SVG.");
        return;
      }

      setIsSubmitting(true);
      setError(null);
      try {
        const result = await createPoint({
          latitude,
          longitude,
          title: values.title.trim(),
          description: values.description.trim(),
          hydrolyzable: values.hydrolyzable,
        });
        if (!result.success) {
          setError(result.error);
          setNotification({
            type: "error",
            message: "При добавлении точки произошла ошибка",
          });
          return;
        }

        const uploadResults = await Promise.allSettled(
          images.map(async ({ file }) => {
            const compressedFile = await compressImage(file);
            const formData = new FormData();
            formData.set("file", compressedFile);
            return uploadImage(formData, result.pointRequestId);
          }),
        );
        const uploadedImages = uploadResults.flatMap((upload, sortOrder) =>
          upload.status === "fulfilled"
            ? [{ storagePath: upload.value, sortOrder }]
            : [],
        );

        try {
          await savePointRequestImages(result.pointRequestId, uploadedImages);
        } catch {
          // The point request is already created; image failures do not change its success.
        }

        setNotification({
          type: "success",
          message: "Точка добавилась успешно",
        });
        setValues({
          latitude: "",
          longitude: "",
          title: "",
          description: "",
          hydrolyzable: false,
        });
        images.forEach(({ previewUrl }) => URL.revokeObjectURL(previewUrl));
        setImages([]);
        setIsSelectingLocation(false);
        setIsAddingPoint(false);
        router.refresh();
      } catch {
        setError("Не удалось добавить точку. Попробуйте ещё раз.");
        setNotification({
          type: "error",
          message: "При добавлении точки произошла ошибка",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      isSubmitting,
      router,
      setIsAddingPoint,
      setIsSelectingLocation,
      setValues,
      images,
      setImages,
      user,
      values,
    ],
  );

  const handleClose = useCallback(() => {
    if (isSubmitting) return;
    setIsSelectingLocation(false);
    setIsAddingPoint(false);
    setError(null);
  }, [isSubmitting, setIsAddingPoint, setIsSelectingLocation]);

  return {
    handleAddPoint,
    handleChange,
    handleClose,
    handleSubmit,
    isVisible: isAddingPoint,
    isAuthPromptVisible,
    setIsAuthPromptVisible,
    isSubmitting,
    error,
    values,
    notification,
  };
};
