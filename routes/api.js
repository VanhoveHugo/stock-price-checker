/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

const StockData = require('../models/stockData.js');
const stockHandler = require('../controller/stockHandler.js');

module.exports = function(app) {
  app.route('/api/stock-prices').get(function(req, res) {
    const stocks = req.query.stock;
    const like = req.query.like;
    const ip = req.ip;

    switch (typeof stocks) {
      case 'string':
        stockHandler.getStock(stocks, like, ip).then(stock => res.json(stock));
        break;
      case 'object':
        if (stocks.length > 2) return res.json({ error: 'too many Stocks!' });

        stockHandler.compareStocks(stocks, like, ip).then(stocks => {
          
          res.json(stocks);
        });
    }
  });
};
