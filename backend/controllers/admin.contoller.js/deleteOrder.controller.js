import asyncHandler from "../../utils/asyncHandler.utils.js";
import ApiError from "../../utils/ApiError.utils.js";
import Order from "../../models/order.model.js";

const deleteOrder=asyncHandler(async(req,res)=>{
    const { orderId }=req.params;
    const order=await Order.findById(orderId);
    if(!order){
        throw new ApiError(404,"orders doesnt exist!");
    }
    await order.deleteOne();
    res.status(200).json({message:"Order deleted successfully"});
})
export default deleteOrder;
