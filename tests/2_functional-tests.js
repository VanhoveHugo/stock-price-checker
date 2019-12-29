/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const stockData = require('../models/stockData.js');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  suite('GET /api/stock-prices => stockData object', function() {
    before(function(done) {
      stockData.deleteMany({}, err => {
        done();
      });
    });

    after(function(done) {
       stockData.deleteMany({}, err => {
         done();
       });
    });

    test('1 stock', function(done) {
      chai
        .request(server)
        .get('/api/stock-prices')
        .query({ stock: 'goog' })
        .end(function(error, res) {
          if (error) return console.log(error);
          assert.equal(res.status, 200);
          assert.property(
            res.body,
            'stockData',
            'response should contain a stockData property'
          );
          assert.property(
            res.body.stockData,
            'stock',
            'stockData should contain a stock property '
          );
          assert.property(
            res.body.stockData,
            'price',
            'stockData should contain a price property'
          );
          assert.property(
            res.body.stockData,
            'likes',
            'stockData should contain a likes property'
          );

          assert.equal(res.body.stockData.stock, 'GOOG');
          assert.equal(res.body.stockData.likes, 0);
          done();
        });
    });

    test('1 stock with like', function(done) {
      chai
        .request(server)
        .get('/api/stock-prices')
        .query({ stock: 'goog', like: true })
        .end(function(error, res) {
          if (error) return console.log(error);
          assert.equal(res.status, 200);
          assert.property(
            res.body,
            'stockData',
            'response should contain a stockData property'
          );
          assert.property(
            res.body.stockData,
            'stock',
            'stockData should contain a stock property '
          );
          assert.property(
            res.body.stockData,
            'price',
            'stockData should contain a price property'
          );
          assert.property(
            res.body.stockData,
            'likes',
            'stockData should contain a likes property'
          );

          assert.equal(res.body.stockData.stock, 'GOOG');
          assert.equal(res.body.stockData.likes, 1);
          done();
        });
    });

    test('1 stock with like again (ensure likes arent double counted)', function(done) {
      chai
        .request(server)
        .get('/api/stock-prices')
        .query({ stock: 'goog', like: true })
        .end(function(error, res) {
          if (error) return console.log(error);
          assert.equal(res.status, 200);
          assert.property(
            res.body,
            'stockData',
            'response should contain a stockData property'
          );
          assert.property(
            res.body.stockData,
            'stock',
            'stockData should contain a stock property '
          );
          assert.property(
            res.body.stockData,
            'price',
            'stockData should contain a price property'
          );
          assert.property(
            res.body.stockData,
            'likes',
            'stockData should contain a likes property'
          );

          assert.equal(res.body.stockData.stock, 'GOOG');
          assert.equal(res.body.stockData.likes, 1);
          done();
        });
    });

    test('2 stocks', function(done) {
      chai
        .request(server)
        .get('/api/stock-prices')
        .query({ stock: ['aapl', 'msft'] })
        .end(function(error, res) {
          if (error) return console.log(error);
          assert.equal(res.status, 200);

          assert.property(
            res.body,
            'stockData',
            'response should contain a stockData property'
          );

          assert.isArray(
            res.body.stockData,
            'stockData property should be an array'
          );

          assert.property(
            res.body.stockData[0],
            'stock',
            'stockData should contain a stock property '
          );
          assert.property(
            res.body.stockData[0],
            'price',
            'stockData should contain a price property'
          );
          assert.property(
            res.body.stockData[0],
            'rel_likes',
            'stockData should contain a rel_likes property'
          );

          assert.property(
            res.body.stockData[1],
            'stock',
            'stockData should contain a stock property '
          );
          assert.property(
            res.body.stockData[1],
            'price',
            'stockData should contain a price property'
          );
          assert.property(
            res.body.stockData[1],
            'rel_likes',
            'stockData should contain a rel_likes property'
          );

          assert.equal(res.body.stockData[0].stock, 'AAPL');
          assert.equal(res.body.stockData[0].rel_likes, 0);
          assert.equal(res.body.stockData[1].stock, 'MSFT');
          assert.equal(res.body.stockData[1].rel_likes, 0);

          done();
        });
    });

    test('2 stocks with like', function(done) {
      chai
        .request(server)
        .get('/api/stock-prices')
        .query({ stock: ['aapl', 'msft'], like: true })
        .end(function(error, res) {
          if (error) return console.log(error);
          assert.equal(res.status, 200);

          assert.property(
            res.body,
            'stockData',
            'response should contain a stockData property'
          );

          assert.isArray(
            res.body.stockData,
            'stockData property should be an array'
          );

          assert.property(
            res.body.stockData[0],
            'stock',
            'stockData should contain a stock property '
          );
          assert.property(
            res.body.stockData[0],
            'price',
            'stockData should contain a price property'
          );
          assert.property(
            res.body.stockData[0],
            'rel_likes',
            'stockData should contain a rel_likes property'
          );

          assert.property(
            res.body.stockData[1],
            'stock',
            'stockData should contain a stock property '
          );
          assert.property(
            res.body.stockData[1],
            'price',
            'stockData should contain a price property'
          );
          assert.property(
            res.body.stockData[1],
            'rel_likes',
            'stockData should contain a rel_likes property'
          );

          assert.equal(res.body.stockData[0].stock, 'AAPL');
          assert.equal(res.body.stockData[0].rel_likes, 0);
          assert.equal(res.body.stockData[1].stock, 'MSFT');
          assert.equal(res.body.stockData[1].rel_likes, 0);

          done();
        });
    });
  });
});
