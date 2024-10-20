describe('POST /todo/add', () => {
    it('should add a new todo item', (done) => {
        request(app)
            .post('/todo/add')
            .send({ newtodo: 'Test Item' })
            .expect(302)
            .expect('Location', '/todo')
            .end((err, res) => {
                if (err) return done(err);
                // Delay for a moment to allow redirection
                setTimeout(() => {
                    request(app)
                        .get('/todo')
                        .end((err, res) => {
                            if (err) return done(err);
                            assert(res.text.includes('Test Item'), 'New item should appear in list');
                            done();
                        });
                }, 500);  // Give some time for the list to update
            });
    });
});

describe('PUT /todo/edit/:id', () => {
    it('should edit an existing todo item', (done) => {
        request(app)
            .post('/todo/add')
            .send({ newtodo: 'Edit Me' })
            .end((err, res) => {
                if (err) return done(err);
                // Wait for the list to update
                setTimeout(() => {
                    request(app)
                        .put('/todo/edit/0')
                        .send({ editTodo: 'Edited Item' })
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
                }, 500);  // Wait for the item to be added
            });
    });
});
