import * as Yup from "yup"
import { FormValues } from "./types"

export const initialValues: FormValues = {
  importName: "",
  manifestFile: null,
  splitSchedule: "",
  client: "",
  testingCenter1: "",
  testingCenter2: "",
  testingCenter3: "",
  testingCenter4: "",
  toleranceWindow: false
}

export const validationSchema = Yup.object({
  importName: Yup.string()
    .required("Import name is required")
    .oneOf(["Import ABC", "Import DEF", "Import GHI"], "Invalid Import Name"),
  manifestFile: Yup.mixed().required("A file is required").nullable(), // Allows for null values
  splitSchedule: Yup.string().required("This field is required").oneOf(["Yes", "No"], "Invalid Option"),
  client: Yup.string().required("Client selection is required").oneOf(["Single", "Multiple"], "Invalid Client Type"),
  toleranceWindow: Yup.boolean().required("Tolerance window selection is required"), // Assuming this is a boolean represented by a toggle
})
