import ProductCardWrapper from './components/ProductCardWrapper'
export default function ProductCard(props) {
  const { product, width } = props
  return <ProductCardWrapper vtexProduct={product} width={width} />
}
