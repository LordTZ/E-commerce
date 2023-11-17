import prisma from "@/lib/db/db"
import { redirect } from "next/navigation"
import FormSubmitButton from "@/components/FormSubmitButton"
import { getServerSession } from "next-auth"
import { authOption } from "../api/auth/[...nextauth]/route"

export const metadata = {
  title: 'Add Products - Amazled',
  description: 'Add products to your store',
};

async function addProduct(formData: FormData) {
  "use server";

  const session = await getServerSession(authOption)

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-products")
  }

  const name = formData.get('name')?.toString()
  const description = formData.get('description')?.toString()
  const imageURL = formData.get('imageURL')?.toString()
  const price = Number(formData.get('price') || 0)

  if (!name || !description || !imageURL || !price) {
    throw new Error('Please fill in all fields')
  }

  for (let i = 0; i < 50; i++) {
    await prisma.product.create({
    data: {
      name,
      description,
      imageURL,
      price,
      }
    })
  }

  

  redirect("/")
}

const addProductPage = async () => {

  const session = await getServerSession(authOption)

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-products")
  }

  return (
    <div>
      <h1 className="text-lg mb-4 font-bold">Add Products</h1>
        <form action={addProduct}>
          <input 
            required
            name="name"
            placeholder="Name"
            className="autocomplete mb-4 w-full input-bordered input "
          />
          <textarea
            required
            name="description"
            placeholder="Description"
            className="mb-4 w-full textarea textarea-bordered"
          />
          <input 
            required
            name="imageURL"
            placeholder="Image URL"
            type="url"
            className="mb-4 w-full input-bordered input "
          />
          <input 
            required
            name="price"
            placeholder="Price"
            type="number"
            className="mb-4 w-full input-bordered input "
          />
          <FormSubmitButton className="btn-block">
            Add Product
          </FormSubmitButton>
        </form>
    </div>
  )
}

export default addProductPage