import { v2 as cloudinary } from 'cloudinary';

// Cloudinary configurations
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
});
const upload_preset = process.env.CLOUDINARY_UPLOAD_PRESET as string;

interface IFileType {
  avatarFile?: string;
  postBannerFile?: string;
  postImageFile?: string;
}

export const handleUpload = async (file: IFileType) => {
  try {
    if (file.avatarFile) {
      const { avatarFile } = file;
      const uploadResponse = await cloudinary.uploader.unsigned_upload(
        avatarFile,
        upload_preset,
        {
          folder: 'avatar',
          overwrite: true,
          transformation: {
            crop: 'fit',
          },
        },
      );
      return uploadResponse;
    } else if (file.postBannerFile) {
      const { postBannerFile } = file;
      const uploadResponse = await cloudinary.uploader.unsigned_upload(
        postBannerFile,
        upload_preset,
        {
          folder: 'postBanner',
          overwrite: true,
  
        },
      );
      return uploadResponse;
    } else if (file.postImageFile) {
      const { postImageFile } = file;
      const uploadResponse = await cloudinary.uploader.unsigned_upload(
        postImageFile,
        upload_preset,
        {
          folder: 'postImageFiles',
          overwrite: false,
        },
      );
      return uploadResponse;
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Internal server error, please try again later';
    throw new Error(errorMessage);
  }
};
