import asyncHandler from "../../utils/asyncHandler.utils.js";
import ApiError from "../../utils/ApiError.utils.js";
import Order from "../../models/order.model.js";

const updateOrder=asyncHandler(async(req,res)=>{
    const {orderId}=req.params;
    const {orderStatus,paymentStatus}=req.body;

    const order=await Order.findById(orderId);
    if(!order) throw new ApiError(404,"order doesnt exist")

    if(orderStatus){
        order.orderStatus=orderStatus;
        if(orderStatus=="delivered"){
            order.deliveredAt=new Date();
        }
    }
    if(paymentStatus){
        order.paymentStatus=paymentStatus;
    }

    await order.save();

    res.status(200).json({message:"order updated successfully",order,})
})

export default updateOrder;