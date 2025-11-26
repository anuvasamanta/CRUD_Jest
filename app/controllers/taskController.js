const Task = require('../models/Task');

class TaskController {

  async getAllTasks(req, res, next) {
    try {
      const { page = 1, limit = 10, status, priority } = req.query;
      
      const filter = { user: req.user._id };
      if (status) filter.status = status;
      if (priority) filter.priority = priority;

      const tasks = await Task.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Task.countDocuments(filter);

      res.json({
        success: true,
        data: {
          tasks,
          pagination: {
            current: parseInt(page),
            pages: Math.ceil(total / limit),
            total
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getTask(req, res, next) {
    try {
      const task = await Task.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      res.json({
        success: true,
        data: {
          task
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async createTask(req, res, next) {
    try {
      const taskData = {
        ...req.body,
        user: req.user._id
      };

      const task = await Task.create(taskData);

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: {
          task
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req, res, next) {
    try {
      let task = await Task.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      task = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        message: 'Task updated successfully',
        data: {
          task
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req, res, next) {
    try {
      const task = await Task.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      await Task.findByIdAndDelete(req.params.id);

      res.json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TaskController();