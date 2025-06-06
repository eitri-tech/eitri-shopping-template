import {View, TextInput} from "eitri-luminus";
export default function CInput(props) {
  const { icon, type, backgroundColor, mask, onChange, value, ...rest } = props
  return (
    <View
      className="flex items-center text-neutral-content px-2 w-full h-[40px]"
    >
     <TextInput onChange={onChange} className="input-bordered rounded-full w-[85vw]" 
      value={value}
      type={type || 'search'}  placeholder="Encontre seu produto.."/>  
    </View>
  )
}
