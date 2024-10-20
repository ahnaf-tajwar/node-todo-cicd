const request = require('supertest');
const app = require('./app');
const assert = require('assert');

describe('To-do List App', () => {
    let server;

    before(() => {
        server = app.listen(8001); // Start the app on a different port for testing
    });

    after(() => {
        server.close(); // Close the server after tests
    });

    describe('GET /todo', () => {
        it('should return the todo list', (done) => {
            request(app)
                .get('/todo')
                .expect(200) // Expecting HTTP status 200
                .end((err, res) => {
                    if (err) return done(err);
                    // Check if the page contains a form (this is part of your ejs page)
                    assert(res.text.includes('<form'), 'Expected HTML form in response');
                    done();
                });
        });
    });

    describe('GET /todo/delete/:id', () => {
        it('should delete a todo item', (done) => {
            // Add a test item to the list using POST request
            request(app)
                .post('/todo/add')
                .send({ newtodo: 'Item to Delete' })
                .end((err, res) => {
                    if (err) return done(err);

                    // Then delete the item by its ID (assuming ID is 0 for the first item)
                    request(app)
                        .get('/todo/delete/0') // delete the first item
                        .expect(302)
                        .expect('Location', '/todo') // Expect redirection to /todo
                        .end((err, res) => {
                            if (err) return done(err);

                            setTimeout(() => {  // Wait to ensure the page reloads
                                // Check that the item is deleted
                                request(app)
                                    .get('/todo')
                                    .end((err, res) => {
                                        if (err) return done(err);
                                        // Check that the deleted item does not exist in the response
                                        assert(!res.text.includes('Item to Delete'), 'Item should be deleted');
                                        done();
                                    });
                            }, 1500);  // Increased delay for page reload
                        });
                });
        });
    });
});
