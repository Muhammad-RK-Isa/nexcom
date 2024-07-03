import ProductFormSkeleton from "./_components/skeleton"

const loading = () => {
  return (
    <div className="-m-4 bg-fixed p-4 bg-grid-small-black/[0.1] dark:bg-grid-small-white/[0.2] lg:-m-6 lg:p-6">
      <ProductFormSkeleton />
    </div>
  )
}

export default loading
