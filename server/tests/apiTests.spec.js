var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var should = chai.should();

var testCaseReport = require('../routes/testCaseReportAPI');

var Authlib = require('../routes/auth.js');
var auth = new Authlib();

var expect = chai.expect;

chai.use(chaiHttp);

describe('API Tests:', () => {

 it('/testcase report api should be called', (done) => {
 chai.request(app)
     .get('/api/testCaseReportAPI/15022')
     .end((err, res) => {
     res.should.have.status(200);
     done();
});
  done();
});

it('/auth should be called', (done) => {
     auth.get();
     done();
});
});
