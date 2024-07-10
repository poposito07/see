import mongoose, { Document, Schema } from 'mongoose';

export interface WordDocument extends Document {
    palabra: string;
}

const WordSchema = new Schema({
    palabra: { type: String, required: true, unique: true }
});

const Word = mongoose.model<WordDocument>('Word', WordSchema);

export default Word;
