import { Schema, model, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

interface IUser extends Document {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  status: "unverified" | "active" | "suspended" | "banned";
  verificationToken?: string;
  verificationTokenExpires?: Date;
}
interface IUserMethods {
  comparePassword(candidate: string): Promise<boolean>;
}

// 3. Create a type that combines them for the Model
type UserModelType = Model<IUser, {}, IUserMethods>;

const UserSchema = new Schema<IUser, UserModelType, IUserMethods>(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    status: {
      type: String,
      enum: ["unverified", "active", "suspended", "banned"],
      default: "unverified",
    },
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },
  },
  {
    timestamps: true,
  },
);

// UserSchema.pre<IUser>("save", async function () {
//   const salt = await bcrypt.genSalt();
//   this.password = await bcrypt.hash(this.password, salt);
// });
// Updated for Mongoose 9.0 logic
/** * UserSchema.pre("save") for Mongoose 9.0
 */
UserSchema.pre<IUser>("save", async function () {
  // 1. Guard clause: prevents double-hashing on profile updates
  if (!this.isModified("password")) return;

  try {
    // 2. High entropy salt (12 rounds)
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error: any) {
    // 3. In Mongoose 9, throwing inside an async hook rejects the save() promise
    throw new Error(`Password encryption failed: ${error.message}`);
  }
});

UserSchema.methods.comparePassword = async function (
  candidate: string,
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

UserSchema.set("toJSON", {
  transform: (doc, ret: Partial<IUser> & { __v?: number }) => {
    delete ret.password; // The "Final Safety Net"
    delete ret.__v; // Clean up Mongoose versioning
    delete ret.verificationToken;
    return ret;
  },
});

export const UserModel = model<IUser, UserModelType>("User", UserSchema);
