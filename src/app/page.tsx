import prisma from '@/lib/db/db'
import Image from 'next/image'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'
import PaginationBar from '@/components/PaginationBar'

interface HomeProps { 
  searchParams: {
    page: string;
  }
}

export default async function Home({ searchParams: { page = '1'} }: HomeProps) {

  const currentPage = parseInt(page as string)

  const pageSize = 6
  const heroItemsCount = 1

  const totalItemCount = await prisma.product.count()

  const totalPage = Math.ceil((totalItemCount - heroItemsCount) / pageSize)

  const products = await prisma.product.findMany({
    orderBy: {id: 'desc'},
    skip: (currentPage - 1) * pageSize + (currentPage === 1 ? 0 : heroItemsCount), 
    take: pageSize + (currentPage === 1 ? heroItemsCount : 0),
  })

  return (
    <div className='flex flex-col items-center'>
      {currentPage === 1 && (
      <div className='hero rounded-xl bg-base-200'>
        <div className='hero-content flex-col lg:flex-row'>
          <Image 
            src={products[0].imageURL}
            alt={products[0].name}
            width={400}
            height={800}
            className='w-full max-w-sm rounded-lg shadow-2xl'
          />
          <div>
            <h1 className='text-5xl font-bold'>{products[0].name}</h1>
            <p className='py-6'>{products[0].description}</p>
            <Link 
              href={'/product/' + products[0].id}
              className='btn btn-primary'
            >
              Check this out
            </Link>
          </div>
        </div>
      </div> 
      )}

      <div className='my-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'> 
      {(currentPage === 1 ? products.slice(1) : products).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      </div>

      {totalPage > 1 && (
        <PaginationBar currentPage={currentPage} totalPage={totalPage} />
      )}
    </div>

  )
}
