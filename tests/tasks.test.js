const request = require('supertest');
const app = require('../server');
const User = require('../app/models/User');
const Task = require('../app/models/Task');

describe('Tasks API', () => {
  let authToken;
  let userId;

  beforeEach(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});

    // Create a user and get token
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    userId = user._id;

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    authToken = loginResponse.body.data.token;
  });

  describe('GET /api/tasks', () => {
    it('should get all tasks for authenticated user', async () => {
      // Create some tasks
      await Task.create([
        {
          title: 'Task 1',
          user: userId
        },
        {
          title: 'Task 2',
          user: userId
        }
      ]);

      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tasks).toHaveLength(2);
      expect(response.body.data.pagination).toHaveProperty('total', 2);
    });

    it('should return 401 without authentication token', async () => {
      await request(app)
        .get('/api/tasks')
        .expect(401);
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
        priority: 'high'
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.task.title).toBe(taskData.title);
      expect(response.body.data.task.description).toBe(taskData.description);
      expect(response.body.data.task.user).toBe(userId.toString());
    });

    it('should validate task data', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
      const task = await Task.create({
        title: 'Original Task',
        user: userId
      });

      const updateData = {
        title: 'Updated Task',
        status: 'completed'
      };

      const response = await request(app)
        .put(`/api/tasks/${task._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.task.title).toBe(updateData.title);
      expect(response.body.data.task.status).toBe(updateData.status);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .put('/api/tasks/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated Task' })
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      const task = await Task.create({
        title: 'Task to delete',
        user: userId
      });

      const response = await request(app)
        .delete(`/api/tasks/${task._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify task is deleted
      const deletedTask = await Task.findById(task._id);
      expect(deletedTask).toBeNull();
    });
  });
});