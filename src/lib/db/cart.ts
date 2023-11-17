import prisma from "./db";
import { cookies } from "next/headers";
import { Cart, CartItem, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOption } from "@/app/api/auth/[...nextauth]/route";

export type CartWithProducts = Prisma.CartGetPayload<{
    include: { items: { include: { product: true } } }
}>

export type CartItemWithProduct = Prisma.CartItemGetPayload<{
    include: { product: true }
}>

export type ShoppingCart = CartWithProducts & {
    size: number,
    subtotal: number,
}

export async function getCart(): Promise<ShoppingCart | null> {
    const session = await getServerSession(authOption)

    let cart: CartWithProducts | null = null

    if (session) {
        cart = await prisma.cart.findFirst({
            where: { userId: session.user.id },
            include: { items: { include: { product: true } } }
        })

    } else {
        const localCartID = cookies().get("localCartID")?.value
        cart = localCartID 
            ? await prisma.cart.findUnique({
                where: { id: localCartID },
                include: { items: { include: { product: true} } }
                })
            : null
    }

    if (!cart) {
        return null
    }

    return {
        ...cart,
    size: cart.items.reduce((acc, item) => acc + item.quantity, 0),
    subtotal: cart.items.reduce(
      (acc, item) => acc + item.quantity * item.product.price, 0),
    }
}

export async function createCart(): Promise<ShoppingCart> {
    const session = await getServerSession(authOption)

    let newCart: Cart

    if (session) {
        newCart = await prisma.cart.create({
            data : {userId: session.user?.id},
        })
    
    } else {
        newCart = await prisma.cart.create({
            data: {},
        })
        
        // Need to set cookie on the server due to encryption and security in the production 
    cookies().set("localCartID", newCart.id);
    }

    
    return {
        ...newCart,
        items: [],
        size: 0,
        subtotal: 0,
    }
}

export async function mergeAnonymousCartIntoUserCart(userId: string) {
    const localCartID = cookies().get("localCartID")?.value

    const localCart = localCartID
    ? await prisma.cart.findUnique({
        where: { id: localCartID },
        include: { items: true },
        })
    : null

    if (!localCart) {
        return 
    }

    const userCart = await prisma.cart.findFirst({
        where : { userId },
        include: { items: true },
    })

    await prisma.$transaction(async tx => {
        if (userCart) {
            const mergedCartsItems = mergeCartsItems(localCart.items, userCart.items)

            await tx.cartItem.deleteMany({
                where: { cartID: userCart.id },
            })

            await tx.cart.update({
                where: { id: userCart.id },
                data: {
                    items: {
                        createMany: {
                            data: mergedCartsItems.map((item) => ({
                                productID: item.productID,
                                quantity: item.quantity,
                            })),
                        },
                    },
                },
            })

        } else { 
            await tx.cart.create({
                data: { 
                    userId,
                    items:{
                        createMany: {
                            data: localCart.items.map((item) => ({
                                productID: item.productID,
                                quantity: item.quantity,
                            })),
                        },
                    },
                },
            })
        }

        await tx.cart.delete({
            where: { id: localCart.id },
        })

        cookies().set("localCartID", "")
    })
}

function mergeCartsItems (...cartItems: CartItem[][]) {
    return cartItems.reduce((acc, items) => {
        items.forEach((item:any) => {
            const existingItem = acc.find((i) => i.productID === item.productID)
            if (existingItem) {
                existingItem.quantity += item.quantity
            } else {
                acc.push(item)
            }
        })
        return acc
    }, [] as CartItem[])
}