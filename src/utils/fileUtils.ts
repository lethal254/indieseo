import supabase from "./supabaseClient"
import { AppError } from "../middlewares/errorHandler"

export const handleFileUpload = async (file: Express.Multer.File) => {
  // Convert the file buffer directly to Base64
  const fileBase64 = file.buffer.toString("base64")

  try {
    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage
      .from("cv-generator")
      .upload(file.originalname, Buffer.from(fileBase64, "base64"), {
        contentType: file.mimetype, // Use the correct content type from the file
      })

    if (error) {
      throw new AppError(error.message, 500)
    }

    // Get the public URL of the uploaded file
    const { data: image } = supabase.storage
      .from("cv-generator")
      .getPublicUrl(data.path)

    return image.publicUrl
  } catch (error) {
    console.log(error)
    throw new AppError("Something went wrong with the file upload", 500)
  }
}
