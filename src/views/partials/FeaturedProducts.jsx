import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { ProductCard, ProductCardSkeleton } from '../../ui/ProductCard'

export function FeaturedProducts() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['featured'],
    queryFn: async () => {
      const res = await api.get('/api/products?limit=8&page=1')
      return res.data
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between" data-gsap>
        <div>
          <div className="text-xl font-semibold text-[hsl(var(--fg))]">Featured</div>
          <div className="text-sm text-[hsl(var(--muted-fg))]">Fresh picks across categories</div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-gsap>
          {Array.from({ length: 8 }).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))}
        </div>
      ) : isError ? (
        <div className="text-sm text-[hsl(var(--muted-fg))]">Failed to load products</div>
      ) : (
        <>
          <div
            className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth snap-x snap-mandatory lg:hidden"
            data-gsap
          >
            {data.items.map((p) => (
              <div key={p._id} className="w-[78%] shrink-0 snap-start sm:w-[52%]">
                <ProductCard product={p} />
              </div>
            ))}
          </div>

          <div className="hidden grid-cols-2 gap-4 lg:grid" data-gsap>
            {data.items.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
