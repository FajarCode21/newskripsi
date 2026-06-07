import multer from "multer";

const storage = multer.memoryStorage();

const uploadReport = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Format gambar tidak didukung"));
    }

    cb(null, true);
  },
});

export default uploadReport;
