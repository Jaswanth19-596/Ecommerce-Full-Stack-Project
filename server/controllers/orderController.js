import orderModel from './../models/orderModel.js';

export const getOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user.id })
      .populate('products', '-image')
      .populate('buyer');

    res.status(200).send({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log('Error while fetching orders', error.message);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
export const getOrdersForAdmin = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate('products', '-image')
      .populate('buyer');

    res.status(200).send({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log('Error while fetching orders', error.message);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.status(200).send({
      success: true,
      data: order,
    });
  } catch (error) {
    console.log('Error while updating status of order');
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
