import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

cloudinary.config({
  cloud_name: "dnfn5zeaz",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async () => {
  const results = await cloudinary.uploader.upload("./tester.png", {
    folder: "tester",
    type: "authenticated",
    access_mode: "authenticated",
  });
  const url = cloudinary.url(results.public_id, {
    type: "authenticated",
    sign_url: true,
    transformation: [
      { quality: "auto" },
      { fetch_format: "auto" },
      { width: 500 },
    ],
  });
  console.log(url);
};

uploadImage();
