const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
const userSchema = require('../schemas/userSchema');

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const User = mongoose.model('User', userSchema);

class UserModel {
    async getAll() {
        try {
          const users = await User.find().populate('roles').select('-password');
          return users;
        } catch (error) {
          throw error
        }
    }

    async login({ username, password }) {
      try {
        const user = await User.findOne({ username }).populate('roles');
        if (user) {
          const isAuth = await bcrypt.compare(password, user.password);
          if (isAuth) {
            return user;
          }
        }
        return { error: "Invalid username and/or password." };
      } catch (error) {
        return { error: "Database error." }
      }
    }

    async getOne(id) {
      try {
        const user = await User.findOne({ userId: id }).populate('roles').select('-password').lean();
        // console.log(dayjs().tz('Asia/Manila').format('MMMM D, YYYY hh:mm a'))
        user.createdAt = dayjs(user.createdAt).tz('Asia/Manila').format('MMMM D, YYYY hh:mm a')
        return user;
      } catch (error) {
          throw error
      }
    }

    async createNew({ username, password, lastName, firstName, middleName, address, email, roles }) {
        try {
            const existingUser = await User.find({ username });
            console.log(existingUser)
            if (existingUser.length > 0) {
              return { error: "Username is already taken" }
            }

            const userId = nanoid(10);
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ userId, username, password: hashedPassword, lastName, firstName, middleName, address, email, roles });
            await user.save();
            return user;
        } catch (error) {
            throw error;
        }
    }

    async updateOne(id, updates) {
      try {
        const updatedUser = await User.findOneAndUpdate({ userId: id }, updates);
        return updatedUser;
      } catch (error) {
        throw error;
      }
    }

    async deleteOne(id) {
      try {
          const user = await User.findOneAndDelete({ userId: id });
          return user;
      } catch (error) {
          throw error;
      }
  }
}

module.exports = UserModel;