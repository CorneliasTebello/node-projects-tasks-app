import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../app.js';

describe('User API', () => {
	
	//Authorization token
	const token = jwt.sign(
		{ username: 'moneymike' },
		process.env.JWT_SECRET
	);

	it('GET /users should return 401', async () => {
		const res = await request(app)
				.get('/api/users');

		expect(res.statusCode).toBe(401);
	});

	it('GET /users should return 200', async () => {
		const res = await request(app)
				.get('/api/users')
				.set('Cookie', [`token=${token}`])
				;

		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
	});

});