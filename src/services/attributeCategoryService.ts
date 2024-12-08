import prisma from '../config/database';

const getAllCategories = async () => {
  return prisma.attributeCategory.findMany({});
};

const getCategoryById = async (id: number) => {
  return prisma.attributeCategory.findUnique({
    where: { categoryId: id },
    include: { attributes: true },
  });
};

const createCategory = async (data: { name: string; description?: string }) => {
  return prisma.attributeCategory.create({
    data,
  });
};

const updateCategory = async (id: number, data: Partial<{ name: string; description: string }>) => {
  return prisma.attributeCategory.update({
    where: { categoryId: id },
    data,
  });
};

const deleteCategory = async (id: number) => {
  await prisma.attributeCategory.delete({
    where: { categoryId: id },
  });
};

export default {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
