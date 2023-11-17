import prisma from "@/lib/db/db";
import ProductCard from "@/components/ProductCard";
import { Metadata } from "next";

interface searchPageProps {
    searchParams: {
        query: string;
    }
} 

export function generateMetadata({ searchParams: { query }}: searchPageProps) : Metadata {
    return {
        title: `Search results for: ${query} - Amazled`,
    }
}

const page =  async ({ searchParams : { query }}: searchPageProps) => {

    const products = await prisma.product.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
            ]
        },
        orderBy: { id: 'desc' }
    })

    if (products.length === 0) {
        return <div className="text-center">No Product Found</div>
    }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {products.map((product) => (
            <ProductCard 
                key={product.id} 
                product={product} 
            />
        ))}
    </div>
  )
}

export default page