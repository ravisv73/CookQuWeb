import React, { useContext } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Layout from "../components/Layout";
import NextLink from "next/link";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
  Grid,
  Typography,
  Button,
  List,
  ListItem,
} from "@material-ui/core";
import data from "../utils/data";
import { ReceiptRounded } from "@mui/icons-material";
import db from "../utils/db";
import Product from "../models/product";
import { Store } from "../utils/Store";
import axios from "axios";
import { useRouter } from "next/router";

export default function Home(props) {
  const router = useRouter();
  const { products } = props;
  const { state, dispatch } = useContext(Store);

  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry, Product is out of stock");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
    router.push("/order/cart");
  };

  return (
    <Layout>
      <div>
        <h1>Recipes</h1>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item md={4} key={product.name}>
              <Card>
                <NextLink href={`/product/${product.slug}`} passHref>
                  <CardActionArea>
                    <CardContent>
                      <Typography>{product.name}</Typography>
                    </CardContent>
                    <CardMedia
                      component="img"
                      image={`/images/${product.image}`}
                      title={product.name}
                    ></CardMedia>
                  </CardActionArea>
                </NextLink>
                <CardActions>
                  <Typography>Rs.{product.price}/-</Typography>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => addToCartHandler(product)}
                  >
                    Add to cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find(
    {},
    { _id: 1, createdAt: 0, updatedAt: 0, __v: 0 }
  ).lean();
  await db.disconnect();
  return {
    props: {
      products: products.map(db.convertProductDocToObj),
    },
  };
}
