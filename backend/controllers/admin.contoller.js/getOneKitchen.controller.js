import asyncHandler from "../../utils/asyncHandler.utils.js";
import Kitchen from "../../models/kitchen.model.js";

const getOneKitchen = asyncHandler(async (req, res) => {
    const {kitchenId}=req.params;
    const kitchen=await Kitchen.findById(kitchenId);
    if(!kitchen){
        throw new ApiError(404,"Kitchen nto found");
    }
    res.status(200).json({message:"Kitchen fetched successfully",kitchen});
});

export default getOneKitchen;
