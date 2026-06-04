"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../lib/products-store";

const PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

async function requireAdmin() {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_auth")?.value !== PASSWORD) {
    redirect("/admin/products?error=login");
  }
}

// Log in directly from the admin page.
export async function adminLogin(formData) {
  if (formData.get("password") === PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("admin_auth", PASSWORD, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    redirect("/admin/products");
  }
  redirect("/admin/products?error=login");
}

// Turn the submitted form into a product object.
function parseProduct(formData) {
  const oldPriceRaw = (formData.get("oldPrice") || "").toString().trim();
  const ratingRaw = (formData.get("rating") || "").toString().trim();
  const reviewsRaw = (formData.get("reviews") || "").toString().trim();

  const product = {
    name: (formData.get("name") || "").toString().trim(),
    price: Number(formData.get("price")),
    image:
      (formData.get("image") || "").toString().trim() ||
      "/products/placeholder.jpg",
    rating: ratingRaw ? Number(ratingRaw) : 0,
    reviews: reviewsRaw ? Number(reviewsRaw) : 0,
    category:
      (formData.get("category") || "").toString().trim() || "Accessories",
    description: (formData.get("description") || "").toString().trim(),
    inStock: formData.get("inStock") === "on",
  };
  if (oldPriceRaw) product.oldPrice = Number(oldPriceRaw);
  return product;
}

export async function createProductAction(formData) {
  await requireAdmin();
  const product = parseProduct(formData);
  if (!product.name || !product.price) {
    redirect("/admin/products?error=fields");
  }
  await addProduct(product);
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
  redirect("/admin/products?added=1");
}

export async function updateProductAction(formData) {
  await requireAdmin();
  const id = (formData.get("id") || "").toString();
  const product = parseProduct(formData);
  if (id && product.name && product.price) {
    await updateProduct(id, product);
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin/products");
  }
  redirect("/admin/products?saved=1");
}

export async function deleteProductAction(formData) {
  await requireAdmin();
  const id = (formData.get("id") || "").toString();
  if (id) {
    await deleteProduct(id);
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin/products");
  }
  redirect("/admin/products?deleted=1");
}
