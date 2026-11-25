import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  { timestamps: true, versionKey: false },
);

userSchema.pre('save', function() {
//  if (this.isNew() && !this.username) {
  if (!this.username) {
    this.username = this.email;
  }
});

userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;

  return user;
};

export const User = model('User', userSchema, 'users');
