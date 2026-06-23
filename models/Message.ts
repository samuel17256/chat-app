import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const messageSchema = new Schema(
  {
    message: { type: String, required: true, trim: true },
    senderName: { type: String, required: true },
    senderEmail: { type: String, required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export type MessageDocument = InferSchemaType<typeof messageSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type ChatMessage = {
  _id: string;
  message: string;
  senderName: string;
  senderEmail: string;
  senderId: string;
  createdAt: string;
};

export const Message: Model<MessageDocument> =
  mongoose.models.Message ?? mongoose.model<MessageDocument>("Message", messageSchema);

export function toChatMessage(doc: MessageDocument): ChatMessage {
  return {
    _id: doc._id.toString(),
    message: doc.message,
    senderName: doc.senderName,
    senderEmail: doc.senderEmail,
    senderId: doc.senderId.toString(),
    createdAt: doc.createdAt.toISOString(),
  };
}
