import Description from './Description'
import Information from './Information'
import Supplier from './Supplier'
export default function DescriptionComponent(props) {
  const { product, ...rest } = props
  const buildSpecifications = (product) => {
    let result = {}
    const isExcluded = (name) => ['Conteudo Enriquecido'].includes(name)
    if (product?.allSpecifications) {
      product?.allSpecifications?.forEach((element) => {
        if (!isExcluded(element)) {
          result[element] = product[element]
        }
      })
    } else {
      // Quando o produto vem através do intelligenceSearch a forma de pegar as especificações são diferente
      let allSpecifications = product?.specificationGroups?.find((group) => group.originalName === 'allSpecifications')
      allSpecifications?.specifications.forEach((element) => {
        if (!isExcluded(element.name)) {
          result[element.name] = element.values
        }
      })
    }
    return [result]
  }
  const especifications = buildSpecifications(product)
  return (
    <View className="flex flex-col gap-1">
      {product?.description && <Description description={product?.description} />}
      {especifications && <Information specifications={especifications} />}
      {(product?.Fornecedor || product?.brand) && <Supplier supplier={product?.Fornecedor?.[0] || product?.brand} />}
    </View>
  )
}
