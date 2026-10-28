import { useAuth } from "@/providers/AuthProvider";
import { createPoint } from "@/features/addPoint/api/createPoint";
import { useCallback, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAddPointContext, type AddPointFormValues } from "../AddPointContext";

export const useAddPoint = () => {
  const { user } = useAuth();
  const router = useRouter();
  const {
    isAddingPoint,
    setIsAddingPoint,
    setIsSelectingLocation,
    values,
    setValues,
  } = useAddPointContext();
  const [isAuthPromptVisible, setIsAuthPromptVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    (field: keyof AddPointFormValues, value: string) => {
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

      setIsSubmitting(true);
      setError(null);
      const result = await createPoint({
        latitude,
        longitude,
        title: values.title.trim(),
        description: values.description.trim(),
      });
      setIsSubmitting(false);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setValues({ latitude: "", longitude: "", title: "", description: "" });
      setIsSelectingLocation(false);
      setIsAddingPoint(false);
      router.refresh();
    },
    [isSubmitting, router, setIsAddingPoint, setIsSelectingLocation, setValues, user, values],
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
  };
};
