import ProductItem from '../ProductItem'

function GridProduct({ isLoading, products }) {

    return (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {
                products.map(product => (
                    <div>
                        {
                            isLoading ? <ProductItem.Loading /> : < ProductItem product={product} />
                        }
                    </div>
                ))

            }
        </div>
    )
}

export default GridProduct
