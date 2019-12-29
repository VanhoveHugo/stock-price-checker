const stockData = require('../models/stockData.js');
const axios = require('axios');

const stockHandler = {
  //Get updated price for specific stock
  getPrice(stock) {
    return axios
      .get('https://sandbox.iexapis.com/stable/stock/market/batch', {
        params: {
          symbols: stock,
          types: 'quote',
          token: process.env.IEXCloud_TOKEN,
          filter: 'symbol,latestPrice',
        },
        responseType: 'json',
      })
      .then(response => {
        const price = response.data[stock.toUpperCase()].quote.latestPrice;
        if (price === null)
          return { error: 'Stock not found for ' + stock.toUpperCase() + '!' };

        return price;
      })
      .catch(function(error) {
        return { error: 'Stock not found for ' + stock.toUpperCase() + '!' };
      });
  },

  //Return stock if exist on db, false if don't
  stockExist(stock) {
    return stockData
      .findOne({ stock: stock.toUpperCase() })
      .then(function(stockFound) {
        if (stockFound !== null) {
          return stockFound;
        }

        return false;
      });
  },

  //Find and add like to stock in db. If ip already like stock, return stock without changes.
  addLikeToStock(stock, ip) {
    if (!stock) {
      return { error: 'Need Stock!' };
    } else if (!ip) {
      return { error: 'Need Ip!' };
    } else if (!stock && !ip) {
      return { error: 'Need Stock and Ip!' };
    }

    return stockData
      .findOne({ stock: stock.toUpperCase() })
      .then(stockFound => {
        if (!stockFound.ipLikes.includes(ip)) {
          stockFound.likes += 1;
          stockFound.ipLikes.push(ip);
          return stockFound.save().then(stockUpdated => {
            return stockUpdated;
          });
        }

        return stockFound;
      })
      .catch(error => {
        error: error.message;
      });
  },

  //Add stock to db with ip and one like.
  addStockToDb(stock, ip) {
    if (!stock) return { error: 'Need Stock' };

    const newStock = new stockData({
      stock: stock.toUpperCase(),
      likes: 1,
      ipLikes: [ip],
    });

    return newStock
      .save()
      .then(stock => {
        return stock;
      })
      .catch(error => {
        error: error.message;
      });
  },

  processStock(stock, like, ip) {
    return Promise.all([this.getPrice(stock), this.stockExist(stock)]).then(
      results => {
        const stockPrice = results[0];
        const stockFound = results[1];

        if (stockPrice.error) return stockPrice;

        if (!stockFound) {
          if (like) {
            return this.addStockToDb(stock, ip).then(newStock => {
              return {
                stock: newStock.stock,
                price: stockPrice,
                likes: 1,
              };
            });
          } else {
            return { stock: stock.toUpperCase(), price: stockPrice, likes: 0 };
          }
        } else {
          if (like) {
            return this.addLikeToStock(stock, ip).then(stockUpdated => {
              return {
                stock: stockUpdated.stock,
                price: stockPrice,
                likes: stockUpdated.likes,
              };
            });
          } else {
            return {
              stock: stockFound.stock,
              price: stockPrice,
              likes: stockFound.likes,
            };
          }
        }
      }
    );
  },

  //Generate response api for a single request. Saving the stock or updating likes when need it.
  getStock(stock, like, ip) {
    return this.processStock(stock, like, ip).then(stockData => {
      return { stockData: stockData };
    });
  },

  //Generate response api when compare to stocks. Saving the stock or updating likes when need it.
  compareStocks(stocks, like, ip) {
    return Promise.all([
      this.processStock(stocks[0], like, ip),
      this.processStock(stocks[1], like, ip),
    ])
      .then(results => {
        const stockData0 = results[0],
          stockData1 = results[1];

        if (stockData0.error || stockData1.error)
          return {
            error: results
              .filter(result => result.error !== undefined)
              .map(error => error.error)
              .join(', '),
          };

        return {
          stockData: [
            {
              stock: stockData0.stock,
              price: stockData0.price,
              rel_likes: stockData0.likes - stockData1.likes,
            },
            {
              stock: stockData1.stock,
              price: stockData1.price,
              rel_likes: stockData1.likes - stockData0.likes,
            },
          ],
        };
      })
      .catch(error => {
        console.log(error);
        return { error: error.message };
      });
  },
};

module.exports = stockHandler;
