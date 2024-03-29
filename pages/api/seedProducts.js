import nc from "next-connect";
import db from "../../utils/db";
import productData from "../../utils/productData";
import Product from "../../models/product";

const handler = nc();

handler.get(async (req, res) => {
  let newProducts = [];
  await db.connect();
  await Product.deleteMany();
  await Product.insertMany(productData.products);
  /*
  let currentProducts = await Product.find(
    { releaseStatus: "Current" },
    { _id: 0 }
  );
  console.log("New Products before..", newProducts);
  currentProducts.forEach((currentProduct) => {
    let newProduct = JSON.parse(JSON.stringify(currentProduct));
    newProduct.version = newProduct.version + 1;
    newProducts.push(newProduct);
  });
  console.log("New Products after..", newProducts);

  await Product.insertMany(currentProducts); */
  await db.disconnect();
  res.send({ message: "Product Data is seeded successfully" });
});

export default handler;
