import {DIMENSIONS} from "../../utils/constants";

export default function HeaderOffset (props) {

  const { topInset, height } = props

  return (
    <>
      {
        topInset && <View topInset />
      }
      <View height={height || DIMENSIONS.HEADER_HEIGHT} />
    </>
  )
}
