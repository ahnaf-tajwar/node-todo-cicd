const request = require('supertest');
const app = require('./app');
const assert = require('assert');

describe('To-do List App', () => {
    let server;

    before(() => {
        server = app.listen(8001); // Starting the app on a different port for testing
    });

    after(() => {
        server.close(); // Close the server after tests
    });

    describe('GET /todo', () => {
        it('should return the todo list', (done) => {
            request(app)
                .get('/todo')
                .expect(200) // HTTP status code for success
                .end((err, res) => {
                    if (err) return done(err);
                    assert(res.text.includes('<form'), 'Expected HTML form in response');
                    done();
                });
        });
    });

    describe('POST /todo/add', () => {
        it('should add a new todo item', (done) => {
            request(app)
                .post('/todo/add')
                .send({ newtodo: 'Test Item' })
                .expect(302) // Redirect status
                .expect('Location', '/todo') // Check redirect
                .end((err, res) => {
                    if (err) return done(err);
                    request(app)
                        .get('/todo')
                        .end((err, res) => {
                            assert(res.text.includes('Test Item'), 'New item should appear in list');
                            done();
                        });
                });
        });
    });

    describe('GET /todo/delete/:id', () => {
        it('should delete a todo item', (done) => {
            request(app)
                .post('/todo/add')
                .send({ newtodo: 'Delete Me' }) // Add item first
                .end((err, res) => {
                    request(app)
                        .get('/todo/delete/0') // Delete the first item (assuming it's ID 0)
                        .expect(302)
                        .expect('Location', '/todo')
                        .end((err, res) => {
                            if (err) return done(err);
                            request(app)
                                .get('/todo')
                                .end((err, res) => {
                                    assert(!res.text.includes('Delete Me'), 'Item should be deleted');
                                    done();
                                });
                        });
                });
        });
    });

    describe('PUT /todo/edit/:id', () => {
        it('should edit an existing todo item', (done) => {
            request(app)
                .post('/todo/add')
                .send({ newtodo: 'Edit Me' }) // Add item first
                .end((err, res) => {
                    request(app)
                        .put('/todo/edit/0')
                        .send({ editTodo: 'Edited Item' }) // Edit the first item
                        .expect(302)
                        .expect('Location', '/todo')
                        .end((err, res) => {
                            if (err) return done(err);
                            request(app)
                                .get('/todo')
                                .end((err, res) => {
                                    assert(res.text.includes('Edited Item'), 'Item should be edited');
                                    done();
                                });
                        });
                });
        });
    });
});
