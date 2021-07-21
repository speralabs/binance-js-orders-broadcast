// import repository
const repository = require('./money.repository');
const binanceCreateOrder = require('../../services/binanceCreateOrder');

// imports
const axios = require('axios');
const Binance = require('node-binance-api');
const config = require('../../config/config');
const {
  TYPE_ISOLATED_STR,
  TYPE_LONG,
  TYPE_MARKET,
  TYPE_BUY,
  TYPE_SELL,
  TYPE_BINANCE,
  TYPE_TRAILING_STOP_MARKET,
  TYPE_LIMIT,
  TYPE_STOP_MARKET,
  TYPE_SHORT,
  TYPE_STOP_LOSS,
} = require('../../config/constants');

/**
 * GET all data set
 * @input
 * @output {array}
 */
module.exports.getAll = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await repository.findAll({});
      if (!data || data.length == 0) {
        resolve([]);
      } else {
        resolve(data);
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * GET single object
 * @input {id}
 * @output {obj}
 */
module.exports.getById = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await repository.findById({ _id: id });
      console.log(data);

      if (!data || data.length == 0) {
        reject('No data found from given id');
      } else {
        resolve(data);
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * POST object
 * @input {object}
 * @output {object}
 */
module.exports.save = async (obj) => {
  return new Promise(async (resolve, reject) => {
    try {
      // extract data from object
      const {
        users,
        symbol,
        position_side,
        exchange_rate,
        quantity_precesion,
      } = obj;

      const promises = [];
      if (users.length > 0) {
        // loop through each user
        users.forEach((user) => {
          // call to start operation
          promises.push(
            this.startOperation(
              user,
              symbol,
              position_side,
              exchange_rate,
              quantity_precesion
            )
          );
        });
        await Promise.all(promises)
          .then((values) => {
            resolve('All jobs successfully completed');
          })
          .catch((error) => {
            reject(error);
          });
      }
    } catch (error) {
      reject(error);
    }
  });
}; 

/**
 * OPERATION start
 * @input {object}
 * @output {object}
 */
module.exports.startOperation = async (
  obj,
  symbol,
  position_side,
  exchange_rate,
  quantity_precesion
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        user_id,
        api_key,
        secret,
        leverage,
        trade_size,
        sell_at,
        is_trailing_stop_enabled,
        trailing_stop_callback_rate,
        stop_loss_at,
        no_of_trades,
      } = obj;

      // init binanceLib
      const binance = new Binance().options({
        APIKEY: api_key,
        APISECRET: secret,
        useServerTime: true,
        test: true,
        recvWindow: 60000,
      });

      //Get account details from API
      let account_details = await binance.futuresAccount();

      //Get wallet balance from account details
      const wallet_balance = account_details.totalCrossWalletBalance;

      //Get open orders from account details
      const open_positions = account_details.positions;

      //Calculate size of the trade which we are going to open using wallet balance(Wallet Balance / 100 * trade size of user )
      const purchase_bal = (wallet_balance / 100) * trade_size;

      //Calculate the quantity of tokens we purchase in this order using trade size and multiplying with user's leverage
      let purchase_quantity = (purchase_bal / exchange_rate) * leverage;

      //Roundup the quantity using number of decimal places of given quantity precision and convert to string
      purchase_quantity = parseFloat(purchase_quantity)
        .toFixed(quantity_precesion)
        .toString();

      //Change user profile margin type of given symbol(ex : BTC) to ISOLATED
      await binance.futuresMarginType(symbol, TYPE_ISOLATED_STR);

      //Change user profile leverage of given symbol provided leverage of user details
      await binance.futuresLeverage(symbol, leverage);

      //If received order type is LONG
      if (position_side == TYPE_LONG) {
        let pos_check = true;
        let pos_count = 0;

        //Get all open positions and check if there are any open long positions for given symbol
        //Set position check variable false if there are open trades for same symbol or no of trades reached user defined limit
        account_details.positions.forEach((position) => {
          if (position.isolatedWallet != 0) {
            pos_count++;
            if (
              position.symbol == symbol &&
              position.positionSide == TYPE_LONG
            ) {
              pos_check = false;
            }
          }

          if (pos_count > no_of_trades - 1) {
            pos_check = false;
          }
        });

        //Opening orders if position check is true
        if (pos_check) {
          //Cancel all limit orders
          binance.futuresCancelAll(symbol);

          //Create order on binance
          const created_order = await binanceCreateOrder.signedRequest(
            api_key,
            secret,
            'POST',
            '/fapi/v1/order',
            {
              symbol: symbol,
              side: TYPE_BUY,
              positionSide : TYPE_LONG,
              type: 'MARKET',
              quantity: purchase_quantity,
              recvWindow: 60000,
            }
          );

          //Create order details array based on created order details returned by binance and save on DB
          //NOTE : This needs to be send to given API end point too
          const orderObj = {
            user_id: user_id,
            trade_id: created_order.data.orderId,
            order_id: created_order.data.orderId,
            status: 1,
            pair: symbol,
            type: TYPE_BUY,
            price: purchase_quantity,
            position_side: TYPE_LONG,
            trade_type: TYPE_BINANCE,
            exchange_price: exchange_rate,
          };
          const data = await repository.save(orderObj);
          //** API call needs to be call here */

          // this.makeAPICall(orderObj);
        }

        //Get account details again and fetch all open orders
        account_details = await binance.futuresAccount();
        account_details.positions.forEach(async (position) => {
          //Select the open trade for given symbol | Finding the recently opened trade above
          if (position.symbol == symbol && position.positionSide == TYPE_LONG) {

            //Get margin and exchange price using opened trade for calculations
            const margin = parseFloat(position.isolatedWallet);
            const pair_ex_price = parseFloat(position.entryPrice);

            //Calculate profit at
            let profit_at = ((((margin / 100) * sell_at) / position.positionAmt) + pair_ex_price);
            profit_at = parseFloat(profit_at).toFixed(this.numberOfDecimals(exchange_rate)).toString();

            //Calculate stop at
            let stop_at = pair_ex_price + ((margin / 100) * stop_loss_at) / (-1 * position.positionAmt);
            stop_at = parseFloat(stop_at).toFixed(this.numberOfDecimals(exchange_rate)).toString();

            if(is_trailing_stop_enabled){
              let limit_order = { 
                symbol : symbol,
                side : TYPE_SELL,
                positionSide : TYPE_LONG,
                type : 'TRAILING_STOP_MARKET',
                timeInForce : 'GTC',
                quantity : purchase_quantity,
                activationPrice : profit_at,
                callbackRate : parseFloat(trailing_stop_callback_rate).toFixed(1).toString(),
                recvWindow: 60000
              };

              await binanceCreateOrder.signedRequest(
                api_key,
                secret,
                'POST',
                '/fapi/v1/order',
                limit_order
              );

            } else {
              let limit_order = { 
                symbol : symbol,
                side : TYPE_SELL,
                positionSide : TYPE_LONG,
                type : 'LIMIT',
                timeInForce : 'GTC',
                quantity : purchase_quantity,
                price : profit_at,
                recvWindow: 60000
              };

              await binanceCreateOrder.signedRequest(
                api_key,
                secret,
                'POST',
                '/fapi/v1/order',
                limit_order
              );
              
            }

            let stop_loss_order = { symbol : symbol,
              side : TYPE_SELL,
              positionSide : TYPE_LONG,
              type : 'STOP_MARKET',
              timeInForce : 'GTC',
              quantity : purchase_quantity,
              stopPrice : stop_at,
              recvWindow: 60000
            };

            await binanceCreateOrder.signedRequest(
              api_key,
              secret,
              'POST',
              '/fapi/v1/order',
              stop_loss_order
            );
         }
        });

        //Get all open short trades from database for the given symbol and position side
        const open_orders = await repository.findAll({pair : symbol, type : TYPE_SELL, position_side : TYPE_SHORT, status : 1, user_id: user_id});

        open_orders.forEach(async (order) => {
          if(order.trade_id){
            await binanceCreateOrder.signedRequest(
              api_key,
              secret,
              'POST',
              '/fapi/v1/order',
              {
                symbol: symbol,
                side: TYPE_BUY,
                positionSide : TYPE_SHORT,
                type: 'MARKET',
                quantity: order.price,
                recvWindow: 60000,
              }
            );
          }
        });
      }

      if (position_side == TYPE_SHORT) {
        let pos_check = true;
        let pos_count = 0;

        //Get all open positions and check if there are any open long positions for given symbol
        //Set position check variable false if there are open trades for same symbol or no of trades reached user defined limit
        account_details.positions.forEach((position) => {
          if (position.isolatedWallet != 0) {
            pos_count++;
            if (
              position.symbol == symbol &&
              position.positionSide == TYPE_SHORT
            ) {
              pos_check = false;
            }
          }

          if (pos_count > no_of_trades - 1) {
            pos_check = false;
          }
        });

        //Opening orders if position check is true
        if (pos_check) {
          //Cancel all limit orders
          binance.futuresCancelAll(symbol);

          //Create order on binance
          const created_order = await binanceCreateOrder.signedRequest(
            api_key,
            secret,
            'POST',
            '/fapi/v1/order',
            {
              symbol: symbol,
              side: TYPE_SELL,
              positionSide : TYPE_SHORT,
              type: 'MARKET',
              quantity: purchase_quantity,
              recvWindow: 60000,
            }
          );

          //Create order details array based on created order details returned by binance and save on DB
          //NOTE : This needs to be send to given API end point too
          const orderObj = {
            user_id: user_id,
            trade_id: created_order.data.orderId,
            order_id: created_order.data.orderId,
            status: 1,
            pair: symbol,
            type: TYPE_SELL,
            price: purchase_quantity,
            position_side: TYPE_SHORT,
            trade_type: TYPE_BINANCE,
            exchange_price: exchange_rate,
          };
          const data = await repository.save(orderObj);
          //** API call needs to be call here */

          // this.makeAPICall(orderObj);
        }

        //Get account details again and fetch all open orders
        account_details = await binance.futuresAccount();
        account_details.positions.forEach(async (position) => {
          //Select the open trade for given symbol | Finding the recently opened trade above
          if (position.symbol == symbol && position.positionSide == TYPE_SHORT) {

            //Get margin and exchange price using opened trade for calculations
            const margin = parseFloat(position.isolatedWallet);
            const pair_ex_price = parseFloat(position.entryPrice);

            //Calculate profit at
            let profit_at = ((((margin / 100) * sell_at) / position.positionAmt) + pair_ex_price);
            profit_at = parseFloat(profit_at).toFixed(this.numberOfDecimals(exchange_rate)).toString();

            //Calculate stop at
            let stop_at = pair_ex_price - ((margin / 100) * stop_loss_at) / (position.positionAmt);
            stop_at = parseFloat(stop_at).toFixed(this.numberOfDecimals(exchange_rate)).toString();

            if(is_trailing_stop_enabled){
              let limit_order = { 
                symbol : symbol,
                side : TYPE_BUY,
                positionSide : TYPE_SHORT,
                type : 'TRAILING_STOP_MARKET',
                timeInForce : 'GTC',
                quantity : purchase_quantity,
                activationPrice : profit_at,
                callbackRate : parseFloat(trailing_stop_callback_rate).toFixed(1).toString(),
                recvWindow: 60000
              };

              await binanceCreateOrder.signedRequest(
                api_key,
                secret,
                'POST',
                '/fapi/v1/order',
                limit_order
              );

            } else {
              let limit_order = { 
                symbol : symbol,
                side : TYPE_BUY,
                positionSide : TYPE_SHORT,
                type : 'LIMIT',
                timeInForce : 'GTC',
                quantity : purchase_quantity,
                price : profit_at,
                recvWindow: 60000
              };

              await binanceCreateOrder.signedRequest(
                api_key,
                secret,
                'POST',
                '/fapi/v1/order',
                limit_order
              );
              
            }

            let stop_loss_order = { symbol : symbol,
              side : TYPE_BUY,
              positionSide : TYPE_SHORT,
              type : 'STOP_MARKET',
              timeInForce : 'GTC',
              quantity : purchase_quantity,
              stopPrice : stop_at,
              recvWindow: 60000
            };

            await binanceCreateOrder.signedRequest(
              api_key,
              secret,
              'POST',
              '/fapi/v1/order',
              stop_loss_order
            );
         }
        });

        //Get all open short trades from database for the given symbol and position side
        const open_orders = await repository.findAll({pair : symbol, type : TYPE_BUY, position_side : TYPE_LONG, status : 1, user_id: user_id});
        open_orders.forEach(async (order) => {
          if(order.trade_id){
            await binanceCreateOrder.signedRequest(
              api_key,
              secret,
              'POST',
              '/fapi/v1/order',
              {
                symbol: symbol,
                side: TYPE_SELL,
                positionSide : TYPE_LONG,
                type: 'MARKET',
                quantity: order.price,
                recvWindow: 60000,
              }
            );
          }
        });

        // account_details.positions.forEach(async (position) => {
        //   if (position.symbol == symbol && position.positionSide == TYPE_LONG) {
        //     console.log(position);
        //     let cancel_req = await binance.futuresCancel(symbol, { orderId: position.orderId });
        //     console.log(cancel_req);
        //   }
        // });
      }
      resolve('Process Finished');

    } catch (error) {
      reject(error);
    }
  });
};

/**
 * calculate decimal points
 * @input {objId}
 * @output {object}
 */
module.exports.numberOfDecimals = (number) => {
  const variable = number.toString();

  let decimalPlaces = 0;
  if (variable.includes('.')) {
    decimalPlaces = variable.split('.')[1].length - 1;
  }
  return decimalPlaces;
};

/**
 * Make API call to third party
 * @input {objId}
 * @output {object}
 */
module.exports.makeAPICall = (body) => {
  // headers: {
  //   USER: chat_configurations.user,
  //   DIGEST: chat_configurations.digest,
  //   CREATED: timeStamp,
  // },
  axios({
    method: 'post',
    url: config.responseAPI,
    data: body,
  })
    .then((res) => {
      console.log('-----------------------------------');
      console.log('API CALL CREATED');
      console.log(res);
    })
    .catch((error) => {
      console.log('-----------------------------------');
      console.log('API CALL ERROR OCCURRED');
      // console.log(error);
    });
};

/**
 * PUT object
 * @input {objId}
 * @output {object}
 */
module.exports.updateSingleObj = async (obj) => {
  return new Promise(async (resolve, reject) => {
    const id = obj._id;
    delete obj._id;
    try {
      const data = await repository.updateSingleObject({ _id: id }, obj);
      if (!data) {
        reject('No data found from given id');
      } else {
        resolve(data);
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * DELETE object
 * @input {objId}
 * @output {object}
 */
module.exports.DeleteSingleObject = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await repository.removeObject({ _id: id });
      if (!data) {
        reject('No data found from given id');
      } else {
        resolve(data);
      }
    } catch (error) {
      reject(error);
    }
  });
};
