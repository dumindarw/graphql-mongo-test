const should = require('chai').should()
const assert = require('chai').assert
const url = `http://localhost:3000`;
const request = require('supertest')(url);

//Change username and email to pass test
let query = {
    "query": "mutation{user(username:\"testuser\",firstname:\"Test\",lastname:\"User\",nic:\"889089551V\",password:\"test@123\", " +
        "deviceid: \"888-567-987-123\", email:\"test1@gmail.com\",tp:779906999,location: {type: \"Point\"," +
        "coordinates: [7.413, 80.3147]},currentaddr:{district:\"Kurunegala\", dsdivision:\"Gangoda\"}, verified: false, blackListed:false)" +
        "{username firstname lastname nic password deviceid email tp location {type coordinates} currentaddr {district dsdivision} verified blackListed}}"
}

let delQuery = {
    "query": "mutation{userx(username:\"testuser\") {username}}"
}

let updateQuery = {
    "query": "mutation{useru(username:\"testuser\", firstname:\"Test new\",lastname:\"User new\") {username firstname lastname}}"
}

let updatePWQuery = {
    "query": "mutation{userupw(username:\"testuser\", password:\"test@12345\") {username password}}"
}

describe('GraphQL', () => {
    it('Save User', (done) => {
        request.post('/graphql')
            .query(query)
            .expect(200)
            .end((err, res) => {
                should.not.exist(err);
                should.not.exist(res.body.errors);
                //'{"errors":[{"message":"Request failed with status code 409","locations":[{"line":1,"column":10}],"path":["user"]}],"data":{"user":null}}'

                if (err) return done(err);
                if (res.body.errors) return done(new Error(res.body.errors[0].message));

                res.body.data.user.should.have.property('nic')
                res.body.data.user.should.have.property('username')
                res.body.data.user.should.have.property('currentaddr')
                done();
            })
    })
    it('Update User', (done) => {
        request.post('/graphql')
            .query(updateQuery)
            .expect(200)
            .end((err, res) => {

                should.not.exist(err);
                should.not.exist(res.body.errors);
                
                if (err) return done(err);
                if (res.body.errors) return done(new Error(res.body.errors[0].message));

                res.body.data.useru.should.have.property('firstname')
                res.body.data.useru.should.have.property('username')
                res.body.data.useru.should.have.property('lastname')
                done();
            })
    })
    it('Update User Password', (done) => {
        request.post('/graphql')
            .query(updatePWQuery)
            .expect(200)
            .end((err, res) => {

                should.not.exist(err);
                should.not.exist(res.body.errors);
                            
                if (err) return done(err);
                if (res.body.errors) return done(new Error(res.body.errors[0].message));

                res.body.data.userupw.should.have.property('password')
                res.body.data.userupw.should.have.property('username')
                done();
            })
    })
    it('Delete User', (done) => {
        request.post('/graphql')
            .query(delQuery)
            .expect(200)
            .end((err, res) => {

                should.not.exist(err);
                should.not.exist(res.body.errors);
                if (err) return done(err);

                res.body.data.userx.should.have.property('username')

                done();
            })
    })
    it('Returns User with id = 5cee1f21ddedbc15ec38c433', (done) => {
        request.post('/graphql')
            .send({ query: '{ user(id: "5cee1f21ddedbc15ec38c433") { id nic username currentaddr{district} } }' })
            .expect(200)
            .end((err, res) => {
                should.not.exist(err);
                should.not.exist(res.body.errors);
                if (err) return done(err);

                res.body.data.user.should.have.property('id')
                res.body.data.user.should.have.property('nic')
                res.body.data.user.should.have.property('username')
                res.body.data.user.should.have.property('currentaddr')
                done();
            })
    })
    
    it('Returns All Users', (done) => {
        request.post('/graphql')
            .send({ query: '{ users { id nic username currentaddr{district} } }' })
            .expect(200)
            .end((err, res) => {
                should.not.exist(err);
                should.not.exist(res.body.errors);
                if (err) return done(err);

                //Increase by one when you want to pass test
                res.body.data.users.should.have.lengthOf(1);
                done();
            })
    })
});