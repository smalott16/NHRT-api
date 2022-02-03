const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const assert = chai.assert;
const should = chai.should();

chai.use(chaiHttp);

describe ('/GET forecast of a speficied station', () => {
  it('it should get the forecast data', (done) => {
    chai.request(server)
      .get('/forecast/08NL024')
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        })
      });
    });
    
    describe('/GET hindcast of a specified station', () => {
      it('it should get the hindcast data', (done) => {
        chai.request(server)
        .get('/hindcast/08NL024')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        })
  })
})


