import { asyncHandler } from "../../../utils/asynchandler.js";
import slugify from "slugify";
import cloudinary from "../../../utils/cloudinary.js";
import categoryModel from "../../../../DB/model/Category.model.js";
import SubCategoryModel from "../../../../DB/model/SubCategory.model.js";
import brandModel from "../../../../DB/model/Brand.model.js";
import { nanoid } from "nanoid";
import productModel from "../../../../DB/model/Product.model.js";
import ApiFeatures from "../../../utils/apiFeatures.js";
//1-check category exist
//2-check subcategory exist ==> (categoryId == categoryId.body)
//3-check if brand exist
//4-slug
//5-price --> =totalprice - (total*dis)/100
//6- upload mainimage
//7-if sub --> upload
//createby
export const addProduct = asyncHandler(async (req, res, next) => {
  const { categoryId, subcategoryId, brandId } = req.body;
  if (!(await categoryModel.findOne({ _id: categoryId, isDeleted: false }))) {
    return next(new Error("invalid categoryId"), { cause: 404 });
  }
  if (
    !(await SubCategoryModel.findOne({
      _id: subcategoryId,
      isDeleted: false,
      categoryId,
    }))
  ) {
    return next(new Error("invalid subcategoryId"), { cause: 404 });
  }
  if (!(await brandModel.findOne({ _id: brandId, isDeleted: false }))) {
    return next(new Error(" invalid brandId"), { cause: 404 });
  }
  req.body.slug = slugify(req.body.name, {
    trim: true,
    lower: true,
  });
  req.body.totalPrice =
    req.body.price - (req.body.price * req.body.discount || 0) / 100;
  req.body.customId = nanoid();
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.files.mainImage[0].path,
    {
      folder: `${process.env.APP_NAME}/category/${categoryId}/subcategory/${subcategoryId}/products/${req.body.customId}/mainImage`,
    }
  );
  if (!public_id) {
    return next(new Error("image not uploaded", { cause: 400 }));
  }
  req.body.mainImage = { public_id, secure_url };
  let images = [];
  if (req.files?.subImage?.length) {
    for (const file of req.files.subImage) {
      const { public_id, secure_url } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: `${process.env.APP_NAME}/category/${categoryId}/subcategory/${subcategoryId}/products/${req.body.customId}/subImage`,
        }
      );
      if (!public_id) {
        return next(new Error("image not uploaded", { cause: 400 }));
      }
      images.push({ public_id, secure_url });
    }
    req.body.subImage = images;
  }
  req.body.createdBy = req.user._id;
  const product = await productModel.create(req.body);
  return res.status(201).json({ message: "done", product });
});

export const allProducts = asyncHandler(async (req, res, next) => {
  //   let { page, size } = req.query;
  //   if (!page || page <= 0) {
  //     page = 1;
  //   }
  //   if (!size || size <= 0) {
  //     size = 3;
  //   }
  //     const skip = (page - 1) * size;
  // const excludeQuery = req.query;
  // const includeArray = ["page", "size", "sort", "fields", "search"];
  // includeArray.forEach((element) => {
  //   delete excludeQuery[element];
  // });

  // const filter = JSON.parse(
  //   //regex should be accurate
  //   JSON.stringify(excludeQuery).replace(
  //     /(gt|lt|gte|lte|eq|in|nin|ne)/g,
  //     (match) => `$${match}`
  //   )
  // );
  // let mongooseQuery = productModel.find(filter);
  //   mongooseQuery = mongooseQuery.limit(size).skip(skip);
  // const allProducts = await mongooseQuery

  const apiFeatures = new ApiFeatures(productModel.find(), req.query).pagination().filter().sort().fields().search()
  const allProducts = await apiFeatures.mongooseQuery

  res.status(200).json({ message: "done", allProducts });
});

export const oneProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const oneProduct = await productModel.findOne({ _id: productId });
  res.status(200).json({ message: "done", oneProduct });
});
//check product exist
//check category exist
//check subcategory exist ==> (categoryId == categoryId.body)
//check if brand exist
//if name --> change slug
//if price or discount change --> =totalprice - (total*dis)/100
//upload mainimage
//if sub --> upload
//createby

export const updateProduct = asyncHandler(async (req, res, next) => {
  const { categoryId, subcategoryId, brandId } = req.body;
  const productExist = await productModel.findById({
    _id: req.params.productId,
  });
  if (!productExist) {
    return next(new Error("invalid productId"), { cause: 404 });
  }
  if (!(await categoryModel.findOne({ _id: categoryId, isDeleted: false }))) {
    return next(new Error("invalid categoryId"), { cause: 404 });
  }
  if (
    !(await SubCategoryModel.findOne({
      _id: subcategoryId,
      isDeleted: false,
      categoryId,
    }))
  ) {
    return next(new Error("invalid subcategoryId"), { cause: 404 });
  }
  if (!(await brandModel.findOne({ _id: brandId, isDeleted: false }))) {
    return next(new Error(" invalid brandId"), { cause: 404 });
  }
  req.body.slug = slugify(req.body.name, {
    trim: true,
    lower: true,
  });
  req.body.totalPrice =
    req.body.price - (req.body.price * req.body.discount || 0) / 100;
  req.body.customId = nanoid();
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.files.mainImage[0].path,
    {
      folder: `${process.env.APP_NAME}/category/${categoryId}/subcategory/${subcategoryId}/products/${req.body.customId}/mainImage`,
    }
  );
  if (!public_id) {
    return next(new Error("image not uploaded", { cause: 400 }));
  }
  req.body.mainImage = { public_id, secure_url };
  let images = [];
  if (req.files?.subImage?.length) {
    for (const file of req.files.subImage) {
      const { public_id, secure_url } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: `${process.env.APP_NAME}/category/${categoryId}/subcategory/${subcategoryId}/products/${req.body.customId}/subImage`,
        }
      );
      if (!public_id) {
        return next(new Error("image not uploaded", { cause: 400 }));
      }
      images.push({ public_id, secure_url });
    }
    req.body.subImage = images;
  }
  req.body.createdBy = req.user._id;
  const product = await productModel.create(req.body);
  return res.status(201).json({ message: "done", product });
});
