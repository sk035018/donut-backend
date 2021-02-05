module.exports = {
  imageFilter: (_, file, cb) => {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
      return cb(new Error("Only Images are allowed !!!"), false);
    }
    cb(null, true);
  },

  mediaFilter: (_, file, cb) => {
    if (
      !file.originalname.match(
        /\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|mp4|MP4|mov|MOV|wmv|WMV|flv|FLV|avi|AVI|mkv|MKV|WebM|avchd|AVCHD)$/
      )
    ) {
      return cb(new Error("Only Images or Videos are allowed !!!"), false);
    }
    cb(null, true);
  },
};
