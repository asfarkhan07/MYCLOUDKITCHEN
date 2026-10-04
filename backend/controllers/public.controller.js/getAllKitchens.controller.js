import asyncHandler from "../../utils/asyncHandler.utils.js";
import Kitchen from "../../models/kitchen.model.js";

const getAllKitchen=asyncHandler(async(req,res)=>{
    const kitchens=await Kitchen.find({status:"active"}).sort({createdAt:-1});
    res.status(200).json({
        count:kitchens.length,
        kitchens,
    })
})

export default getAllKitchen;