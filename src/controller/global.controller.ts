import { Request, Response } from "express";
import { myDataSource } from '../app-data-source';
import { Brand } from '../entities/brand.entity';
import { Model } from '../entities/model.entity';
import { SubCategory } from "../entities/sub-category.entity";
const brandRepository = myDataSource.getRepository(Brand);
const modelRepository = myDataSource.getRepository(Model);
const subCategoryRepository = myDataSource.getRepository(SubCategory);

export const AllBrandModelAndVariants = async (req: Request, res: Response) => {
    try {
        const brands = await brandRepository.find({
          select: ['id', 'name', 'slug'],
          relations: {
            models: {
              variants: true,
            },
          },
        });
    
        // Manually select only id, name, slug from nested relations
        const data = brands.map((brand) => ({
          id: brand.id,
          name: brand.name,
          slug: brand.slug,
          models: brand.models?.map((model) => ({
            id: model.id,
            name: model.name,
            slug: model.slug,
            variants: model.variants?.map((variant) => ({
              id: variant.id,
              name: variant.name,
              slug: variant.slug,
            })) || [],
          })) || [],
        }));
    
        res.send({
            data
        });
      } catch (error) {
        console.error("Error fetching brand/model/variant data:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
}

export const AllModelsBySubCategory = async (req: Request, res: Response) => {
  const { identifier } = req.params;
  let subCategory : SubCategory | null = null;
  if (!isNaN(Number(identifier))) {
      // If it's a number, assume it's an ID
      subCategory = await subCategoryRepository.findOne({
        where: { id: Number(identifier) },
      });
  } else {
      // Otherwise, assume it's a slug
      subCategory = await subCategoryRepository.findOne({
        where: { slug: identifier },
      });
  }
  try {

    if (!subCategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    // Find models related to that subcategory
    const models = await modelRepository.find({
      where: {
        sub_category: { id: subCategory.id },
      },
      select: ['id', 'name', 'slug'],
      relations: {
        variants: true,
      },
    });


    res.send({ models });
    // Format the response
    // const data = models.map(model => ({
    //   id: model.id,
    //   name: model.name,
    //   slug: model.slug,
    //   variants: model.variants?.map(variant => ({
    //     id: variant.id,
    //     name: variant.name,
    //     slug: variant.slug,
    //   })) || [],
    // }));

    // return res.json({ data });
  } catch (error) {
    console.error("Error fetching models by subcategory:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
