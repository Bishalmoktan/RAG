import multer from "multer";

const storage = multer.diskStorage({
  destination: function (_, _file, cb) {
    cb(null, "./uploads");
  },
  filename: function (_, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images and PDFs are allowed"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
});
