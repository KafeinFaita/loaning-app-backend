const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const roleSchema = require('../schemas/roleSchema');

const Role = mongoose.model('Role', roleSchema);

class RoleModel { 
    async getOne(id) {
        try {
            const role = Role.findOne({ roleId: id });
            return role;
        } catch (error) {
            throw error;
        }
    }

    async getAll() {
        try {
            const roles = await Role.find();
            return roles;
        } catch (error) {
            throw error;
        }
    }

    async createNew ({ title, privileges }) {
        try {
            const roleId = nanoid(10);
            const role = new Role({ roleId, title, privileges });
            await role.save();
        } catch (error) {
            throw error;
        }
    }

    async updateOne(id, updates) {
        try {
            const updatedRole = await Role.findOneAndUpdate({ roleId: id }, updates)
            return updatedRole;
        } catch (error) {
            throw error
        }
    }

    async deleteOne(id) {
        try {
            const role = await Role.deleteOne({ roleId: id });
            return role;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = RoleModel;