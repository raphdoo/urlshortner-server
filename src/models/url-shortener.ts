import mongoose from 'mongoose';

interface ShorturlAttrs {
  shortCode: string;
  longUrl: string;
  shortUrl: string;
  qrCode?: string;
  userId: string;
  date?: Date;
}

//This is seto have the possibility of adding additional properties in the future
interface ShorturlDoc extends mongoose.Document {
  shortCode: string;
  longUrl: string;
  shortUrl: string;
  qrCode?: string;
  userId: string;
  date?: Date;
}

interface ShortUrlModel extends mongoose.Model<ShorturlDoc> {
  build(attrs: ShorturlAttrs): ShorturlDoc;
}

const ShorturlSchema = new mongoose.Schema(
  {
    shortCode: {
      type: String,
      required: true,
    },
    longUrl: {
      type: String,
      required: true,
    },
    shortUrl: {
      type: String,
      required: true,
    },
    qrCode: {
      type: String,
      default: '',
    },
    userId: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ShorturlSchema.statics.build = (attrs: ShorturlAttrs) => {
  return new Url(attrs);
};

const Url = mongoose.model<ShorturlDoc, ShortUrlModel>('Url', ShorturlSchema);

export { Url };
