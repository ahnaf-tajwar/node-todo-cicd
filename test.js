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
                    console.log('GET /todo response:', res.text);
                    assert(res.text.includes('<form'), 'Expected HTML form in response');
                    done();
                });
        });
    });

    describe('GET /todo/delete/:id', () => {
        it('should delete a todo item', (done) => {
            // First add a test item to the list using a POST request
            request(app)
                .post('/todo/add')
                .send({ newtodo: 'Test Item to Delete' })
                .end((err, res) => {
                    if (err) return done(err);

                    // Then delete the item
                    request(app)
                        .get('/todo/delete/0') // Assuming the ID is 0 for the first item
                        .expect(302)
                        .expect('Location', '/todo')
                        .end((err, res) => {
                            if (err) return done(err);

                            setTimeout(() => {  // Ensure the page reloads
                                request(app)
                                    .get('/todo')
                                    .end((err, res) => {
                                        if (err) return done(err);
                                        console.log('GET /todo after deletion:', res.text);
                                        assert(!res.text.includes('Test Item to Delete'), 'Item should be deleted');
                                        done();
                                    });
                            }, 1500);  // Increased delay for page reload
                        });
                });
        });
    });
});
