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
        trade_type
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
              quantity_precesion,
              trade_type
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
  quantity_precesion,
  trade_type
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        user_id,
        api_key,
        secret,
        leverage,
        trade_size
      } = obj;

      // init binanceLib
      const binance = new Binance().options({
        APIKEY: api_key,
        APISECRET: secret,
        useServerTime: true,
        test: false,
        recvWindow: 60000,
      });

      //Get account details from API
      let account_details = await binance.futuresAccount();

      //Get wallet balance from account details
      const wallet_balance = account_details.totalCrossWalletBalance;

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
      if ((position_side == TYPE_LONG) && (trade_type == TYPE_BUY)) {
        let pos_check = true;

        //Get all open positions and check if there are any open long positions for given symbol
        //Set position check variable false if there are open trades for same symbol or no of trades reached user defined limit
        account_details.positions.forEach((position) => {
          if (position.isolatedWallet != 0) {
            if (
              position.symbol == symbol &&
              position.positionSide == TYPE_LONG
            ) {
              pos_check = false;
            }
          }
        });

        //Opening orders if position check is true
        if (pos_check) {
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
          // const data = await repository.save(orderObj);
          //** API call needs to be call here */

          // this.makeAPICall(orderObj);
        }
      }

      if ((position_side == TYPE_SHORT) && (trade_type == TYPE_BUY)) {
        let pos_check = true;

        //Get all open positions and check if there are any open long positions for given symbol
        //Set position check variable false if there are open trades for same symbol or no of trades reached user defined limit
        account_details.positions.forEach((position) => {
          if (position.isolatedWallet != 0) {
            if (
              position.symbol == symbol &&
              position.positionSide == TYPE_SHORT
            ) {
              pos_check = false;
            }
          }
        });

        //Opening orders if position check is true
        if (pos_check) {
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
          // const data = await repository.save(orderObj);
          //** API call needs to be call here */

          // this.makeAPICall(orderObj);
        }

      }


      if (trade_type == TYPE_SELL) {

         //Set position check variable false if there are open trades for same symbol or no of trades reached user defined limit
         account_details.positions.forEach(async(position) => {
          if ((position.isolatedWallet != 0)) {
            if (
              position.symbol == symbol
            ){
              let side;
              let pos_side;

              if(position.positionSide == TYPE_LONG){
                side = TYPE_SELL;
                pos_side = TYPE_LONG;
              }
  
              if(position.positionSide == TYPE_SHORT){
                side = TYPE_BUY;
                pos_side = TYPE_SHORT;
              }
  
              await binanceCreateOrder.signedRequest(
                api_key,
                secret,
                'POST',
                '/fapi/v1/order',
                {
                  symbol: symbol,
                  side: side,
                  positionSide : pos_side,
                  type: 'MARKET',
                  quantity: Math.abs(position.positionAmt),
                  recvWindow: 60000,
                }
              );
            }
          }
        });
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
      const data = await repository.deleteOne(obj);
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
