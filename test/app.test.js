const server = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;
chai.use(chaiHttp);
describe('Url shortener api', () => {
  it('should fail without url', (done) => {
    chai
      .request(server)
      .get('/v1/url/shorten/')
      .send({ url: '' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it('should fail with invalid url', (done) => {
    chai
      .request(server)
      .get('/v1/url/shorten/')
      .send({ url: 'hey Whats up?' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it('should succeed with url', (done) => {
    chai
      .request(server)
      .get('/v1/url/shorten/')
      .send({ url: 'https://testing.com' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.equals(true);
        done();
      });
  });
});

describe('Url shortener usage api', () => {
  it('should fail without url', (done) => {
    chai
      .request(server)
      .post('/v1/url/shorten/usage/')
      .send({ url: '' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it('should fail with invalid url', (done) => {
    chai
      .request(server)
      .post('/v1/url/shorten/usage/')
      .send({ url: 'hey Whats up?' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it('should succeed with url', (done) => {
    chai
      .request(server)
      .post('/v1/url/shorten/usage/')
      .send({ url: 'https://testing53.com' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.equals(true);
        done();
      });
  });
  it('count should be equal to one', (done) => {
    chai
      .request(server)
      .post('/v1/url/shorten/usage/')
      .send({ url: 'https://testing53.com' })
      .end((err, res) => {
        expect(res.body.data.total_times_shortened).to.equals(1);
        done();
      });
  });
});
