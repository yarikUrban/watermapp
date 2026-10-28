"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

export type AddPointFormValues = {
  latitude: string;
  longitude: string;
  title: string;
  description: string;
  hydrolyzable: boolean;
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
  handleMapClick: (longitude: number, latitude: number) => void;
};

const AddPointContext = createContext<AddPointContextValue | null>(null);

export function AddPointProvider({ children }: { children: ReactNode }) {
  const [isAddingPoint, setIsAddingPoint] = useState(false);
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);
  const [values, setValues] = useState(initialValues);

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
      handleMapClick,
    }),
    [isAddingPoint, isSelectingLocation, values, handleMapClick],
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
