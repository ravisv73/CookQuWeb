import nc from "next-connect";
import db from "../../../utils/db"
import Product from "../../../models/product";

const handler = nc();

handler.get(async(req,res) => {
    await db.connect();
    const products = await Product.find({  }, {_id: 1, createdAt: 0, updatedAt: 0, __v: 0 }).lean();
    await db.disconnect();
    res.send(products)
})

export default handler;