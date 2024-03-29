import { useRouter } from "next/router";
import React from "react";
import Layout from "../../../components/Layout";
import NextLink from "next/link";
import { Grid, Link, List, ListItem, Typography } from "@material-ui/core";
import useStyles from "../../../utils/styles";
import Image from "next/image";
import Product from "../../../models/product";
import MasalaRecipe from "../../../models/masalarecipe";
import db from "../../../utils/db";

export default function PackingScreen(props) {
  const router = useRouter();
  const params = router.query;
  const { product, masalarecipe } = props;
  const servingsrequested = params.servings;
  const servingUnitMeasure = masalarecipe.servings;
  const servingCalc = servingsrequested / servingUnitMeasure;
  const classes = useStyles();
  //const {slug} = router.query;
  //const product = data.products.find((a) => a.slug === slug);
  if (!product) {
    return <div>Cooking instructions Not Found</div>;
  }
  return (
    <Layout title={product.name} description={product.description}>
      <div className={classes.section}>
        <NextLink href="/" passHref>
          <Link>
            <Typography>Back to Products</Typography>
          </Link>
        </NextLink>
      </div>
      <Grid container spacing={1}>
        <Grid item md={4} xs={6}>
          <Image
            src={`/images/${product.image}`}
            alt={product.name}
            width={50}
            height={50}
            layout="responsive"
          ></Image>
        </Grid>
        <Grid item md={6} xs={12}>
          <List>
            <ListItem>
              <Typography component="h4" variant="h4">
                Packing Video
              </Typography>
            </ListItem>
            <ListItem>
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/X5_FFdc8yQg"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={12} xs={24}>
          <List>
            <ListItem>
              <Typography component="h3" variant="h3">
                {masalarecipe.name}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>Category: {masalarecipe.category}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Description: {masalarecipe.description}</Typography>
            </ListItem>
            <ListItem>
              <Typography component="h2" variant="h2">
                Masala Unit Measure: {servingUnitMeasure} servings{" "}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography component="h2" variant="h2">
                Masala recalculated for: {servingsrequested} servings{" "}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography component="h1" variant="h1">
                Ingredients
              </Typography>
            </ListItem>
            <ListItem>
              <Grid>
                {masalarecipe.ingredients.map((ingredient) => (
                  <Grid item md={12} key={ingredient.name}>
                    <List>
                      <ListItem>
                        <Typography component="h1" variant="h1">
                          {ingredient.name}
                        </Typography>
                      </ListItem>
                      <ListItem>
                        <Typography>
                          Amount: {ingredient.amount * servingCalc}{" "}
                          {ingredient.unit}
                        </Typography>
                      </ListItem>
                    </List>
                  </Grid>
                ))}
              </Grid>
            </ListItem>
          </List>
        </Grid>
      </Grid>
      <div></div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await db.connect();
  const product = await Product.findOne(
    { slug },
    { _id: 1, createdAt: 0, updatedAt: 0, __v: 0 }
  ).lean();
  const masalaRecipeSlug = product.masalaRecipeSlug;
  const masalarecipe = await MasalaRecipe.findOne(
    { masalaRecipeSlug },
    { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 }
  );
  console.log("MasalaRecipe: ", masalarecipe);
  await db.disconnect();
  return {
    props: {
      product: db.convertProductDocToObj(product),
      masalarecipe: db.convertMasalaRecipeDocToObj(masalarecipe),
    },
  };
}
