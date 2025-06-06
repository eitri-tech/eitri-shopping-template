import ProductCard from '../../ProductCard/ProductCard'
import ProductCardLoading from './ProductCardLoading'
import {View, Carousel} from "eitri-luminus";

export default function ShelfOfProductsCarousel(props) {
  const { isLoading, products, gap, locale, currency } = props
  const [currentSlide, setCurrentSlide] = useState(0);
  const products_per_page = 2;

  const productsPage = [];
  if (Array.isArray(products)) {
    for (let i = 0; i < products.length; i += products_per_page) {
      productsPage.push(products.slice(i, i + products_per_page));
    }
  }

  const handleScroll = (e) => {
      setCurrentSlide(e);
  };

  return (
    <>
      {isLoading ? (
        <ProductCardLoading gap={gap} />
      ) : (
        <View  className="w-full overflow-x-auto flex space-x-4">
          <Carousel className="flex" config={{
              onChange: handleScroll
            }}
          >
            {productsPage.map((page, index) => (
              <Carousel.Item key={page?.[0]?.productId || index} className="flex w-full gap-2">
                <View className="w-[50%] pl-2">
                  <ProductCard product={page[0]} locale={locale} currency={currency} />
                </View>
                {page.length > 1 ? (
                  <View className="w-[50%] flex justify-center pr-2">
                    <ProductCard product={page[1]} locale={locale} currency={currency} />
                  </View>
                ) : (
                  <View className="h-px w-[50%]" />
                )}
              </Carousel.Item>
            ))}
          </Carousel>
        </View>
      )}
      <View className="mt-8 flex justify-center gap-2">
        {productsPage.map((_, index) => (
          <View
            key={index}
            className={`w-8 h-[6px] ${currentSlide === index ? "bg-green-700" : "bg-neutral-300"}`}
          />
        ))}
      </View>
    </>
  )
}
