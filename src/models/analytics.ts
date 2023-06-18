import mongoose from 'mongoose';

interface AnalyticsAttrs {
  url: string;
  userId?: string;
  timestamp?: Date;
  location: string;
}

//This is seto have the possibility of adding additional properties in the future
interface AnalyticsDoc extends mongoose.Document {
  url: string;
  userId?: string;
  timestamp?: Date;
  location: string;
}

interface AnalyticsModel extends mongoose.Model<AnalyticsDoc> {
  build(attrs: AnalyticsAttrs): AnalyticsDoc;
}

const AnalyticsSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    location: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
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

AnalyticsSchema.statics.build = (attrs: AnalyticsAttrs) => {
  return new Analytics(attrs);
};

const Analytics = mongoose.model<AnalyticsDoc, AnalyticsModel>(
  'Analytics',
  AnalyticsSchema
);

export { Analytics };
