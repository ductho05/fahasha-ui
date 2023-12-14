import ProductItem from '../ProductItem'

function GridProduct({ isLoading, products, isHomePage }) {

    return (
        <div className={`grid gap-4 grid-cols-2 md:grid-cols-3 ${isHomePage ? "lg:grid-cols-5" : "lg:grid-cols-4"}`}>
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
