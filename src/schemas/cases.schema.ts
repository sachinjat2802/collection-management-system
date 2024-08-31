import { Document } from 'mongoose';
import {
  Prop,
  SchemaFactory,
  Schema as MongooseSchema,
} from '@nestjs/mongoose';

@MongooseSchema()
export class Case extends Document {
  @Prop({ required: true })
  bankName: string;

  @Prop({ required: true })
  propertyName: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  borrowerName: string;

  @Prop({ required: true })
  CreatedAt: Date;
}

export const CaseSchema = SchemaFactory.createForClass(Case);
