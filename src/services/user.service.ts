import { UserModel } from "../models/user.model";
import { CreateUserDto } from "../schema/user.schema";

export const createUserService = async (data: CreateUserDto) => {
  const exists = await UserModel.findOne({ email: data.email });
  if (exists) {
    throw new Error("User already exists");
  }

  const user = new UserModel(data);
  await user.save();
  return;
};
