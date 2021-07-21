// import validator class
const joi = require('joi');

// add object schema
module.exports.addOneRecord = joi.object().keys({
  users: joi
    .array()
    .items(
      joi.object().keys({
        user_id: joi.string().required(),
        api_key: joi.string().required(),
        secret: joi.string().required(),
        leverage: joi.number().required(),
        trade_size: joi.number().required(),
        sell_at: joi.number().required(),
        is_trailing_stop_enabled: joi.number().required(),
        trailing_stop_callback_rate: joi.number().required(),
        stop_loss_at: joi.number().required(),
        no_of_trades: joi.number().required(),
      })
    )
    .required(),
  symbol: joi.string().required(),
  position_side: joi.string().required(),
  exchange_rate: joi.number().required(),
  quantity_precesion: joi.number().required(),
});

// update object schema
module.exports.updateOneRecord = joi.object().keys({
  _id: joi.string().required(),
});
