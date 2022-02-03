const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const itemSchema = require('./itemSchema');

const lineItemSchema = new Schema({
  qty: {type: Number, default: 1},
  item: itemSchema
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

lineItemSchema.virtual('extPrice').get(function() {
  // 'this' refers to the lineItem subdocument
  return this.qty * this.item.price;
});

const orderSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  lineItems: [lineItemSchema],
  isPaid: {type: Boolean, default: false}
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

orderSchema.virtual('orderTotal').get(function() {
  // 'this' refers to the order document
  return this.lineItems.reduce((total, item) => total + item.extPrice, 0);
});

orderSchema.virtual('totalQty').get(function() {
  return this.lineItems.reduce((total, item) => total + item.qty, 0);
});

orderSchema.virtual('orderId').get(function() {
  return this.id.slice(-6).toUpperCase();
});

orderSchema.statics.getCart = function(userId) {
  // 'this' refers to the Order model
  return this.findOneAndUpdate(
    // query obj
    {user: userId, isPaid: false},
    // update obj
    {user: userId},
    // options obj
    // upsert option creates the doc if it doesn't exist!
    // new option will make sure the updated doc is returned
    {upsert: true, new: true}
  );
};

orderSchema.methods.addItemToCart = async function(itemId) {
  // 'this' refers to the 'cart' (unpaid order)
  const cart = this;
  const lineItem = cart.lineItems.find(lineItem => lineItem.item._id.equals(itemId));
  if (lineItem) {
    // The item is already in the cart, increase the qty!
    lineItem.qty += 1;
  } else {
    // Not in cart, lets add the item!
    const item = await mongoose.model('Item').findById(itemId);
    cart.lineItems.push({ item });
  }
  return cart.save();
};

orderSchema.methods.setItemQty = function(itemId, newQty) {
  const cart = this;
  const lineItem = cart.lineItems.find(lineItem => lineItem.item._id.equals(itemId));
  if (lineItem && newQty <= 0) {
    lineItem.remove();
  } else if (lineItem) {
    lineItem.qty = newQty;
  }
  return cart.save();
}

module.exports = mongoose.model('Order', orderSchema);