import React from 'react'
import ProductItem from '../ProductItem'

function GridProductLoading() {

    const tempArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    return (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {
                tempArray?.map(() => (
                    <div>
                        {
                            <ProductItem.Loading />
                        }
                    </div>
                ))

            }
        </div>
    )
}

export default GridProductLoading