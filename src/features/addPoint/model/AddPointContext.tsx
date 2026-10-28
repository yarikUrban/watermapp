"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { AUTH_SIGNED_OUT_EVENT } from "@/providers/authEvents";

export type AddPointFormValues = {
  latitude: string;
  longitude: string;
  title: string;
  description: string;
  hydrolyzable: boolean;
};

export type AddPointImage = {
  file: File;
  previewUrl: string;
};

const initialValues: AddPointFormValues = {
  latitude: "",
  longitude: "",
  title: "",
  description: "",
  hydrolyzable: false,
};

type AddPointContextValue = {
  isAddingPoint: boolean;
  setIsAddingPoint: Dispatch<SetStateAction<boolean>>;
  isSelectingLocation: boolean;
  setIsSelectingLocation: Dispatch<SetStateAction<boolean>>;
  values: AddPointFormValues;
  setValues: Dispatch<SetStateAction<AddPointFormValues>>;
  images: AddPointImage[];
  setImages: Dispatch<SetStateAction<AddPointImage[]>>;
  handleMapClick: (longitude: number, latitude: number) => void;
};

const AddPointContext = createContext<AddPointContextValue | null>(null);

export function AddPointProvider({ children }: { children: ReactNode }) {
  const [isAddingPoint, setIsAddingPoint] = useState(false);
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [images, setImages] = useState<AddPointImage[]>([]);
  const imagesRef = useRef(images);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach(({ previewUrl }) =>
        URL.revokeObjectURL(previewUrl),
      );
    };
  }, []);

  const clearDraftOnSignOut = useCallback(() => {
    setIsAddingPoint(false);
    setIsSelectingLocation(false);
    setValues(initialValues);
    imagesRef.current.forEach(({ previewUrl }) =>
      URL.revokeObjectURL(previewUrl),
    );
    imagesRef.current = [];
    setImages([]);
  }, []);

  useEffect(() => {
    window.addEventListener(AUTH_SIGNED_OUT_EVENT, clearDraftOnSignOut);
    return () => {
      window.removeEventListener(AUTH_SIGNED_OUT_EVENT, clearDraftOnSignOut);
    };
  }, [clearDraftOnSignOut]);

  const handleMapClick = useCallback(
    (longitude: number, latitude: number) => {
      if (!isAddingPoint || !isSelectingLocation) return;

      setValues((current) => ({
        ...current,
        longitude: String(longitude.toFixed(6)),
        latitude: String(latitude.toFixed(6)),
      }));

      setIsSelectingLocation(false);
    },
    [isAddingPoint, isSelectingLocation],
  );

  const value = useMemo(
    () => ({
      isAddingPoint,
      setIsAddingPoint,
      isSelectingLocation,
      setIsSelectingLocation,
      values,
      setValues,
      images,
      setImages,
      handleMapClick,
    }),
    [isAddingPoint, isSelectingLocation, values, images, handleMapClick],
  );

  return (
    <AddPointContext.Provider value={value}>
      {children}
    </AddPointContext.Provider>
  );
}

export function useAddPointContext() {
  const context = useContext(AddPointContext);
  if (!context) {
    throw new Error("useAddPointContext must be used within AddPointProvider");
  }
  return context;
}
