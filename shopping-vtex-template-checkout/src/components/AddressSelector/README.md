# AddressSelector Components

Este diretório contém os componentes para a tela de seleção de endereço e pontos de retirada.

## Componentes

### AddressTypeTabs

Componente para as abas de seleção entre entrega e retirada.

**Props:**

-   `selectedTab` (string): Tab atual selecionada ('delivery' ou 'pickup')
-   `onTabChange` (function): Callback para mudança de tab

### AddressCard

Componente reutilizável para exibir cards de endereço ou ponto de retirada.

**Props:**

-   `address` (object): Dados do endereço ou ponto de retirada
-   `isSelected` (boolean): Se o item está selecionado
-   `onClick` (function): Callback para clique no card
-   `showBusinessHours` (boolean): Se deve mostrar horários de funcionamento
-   `title` (string, opcional): Título do card

### DeliveryAddressList

Componente para listar endereços de entrega.

**Props:**

-   `addresses` (array): Lista de endereços disponíveis
-   `selectedAddress` (object): Endereço atualmente selecionado
-   `onAddressSelect` (function): Callback para seleção de endereço
-   `onAddNewAddress` (function): Callback para adicionar novo endereço
-   `isLoading` (boolean): Estado de carregamento

### PickupPointList

Componente para listar pontos de retirada.

**Props:**

-   `pickupPoints` (array): Lista de pontos de retirada disponíveis
-   `selectedAddress` (object): Endereço atualmente selecionado
-   `onPickupPointSelect` (function): Callback para seleção de ponto de retirada
-   `isLoading` (boolean): Estado de carregamento

## Estrutura de Dados

### Endereço de Entrega

```javascript
{
  addressId: string,
  street: string,
  number: string,
  neighborhood: string,
  city: string,
  state: string,
  postalCode: string,
  addressType: 'residential'
}
```

### Ponto de Retirada

```javascript
{
  id: string,
  friendlyName: string,
  address: {
    addressId: string,
    street: string,
    number: string,
    neighborhood: string,
    city: string,
    state: string,
    postalCode: string,
    addressType: 'pickup'
  },
  businessHours: [
    {
      DayOfWeek: number,
      OpeningTime: string,
      ClosingTime: string
    }
  ]
}
```

## Uso

```javascript
import { AddressTypeTabs, DeliveryAddressList, PickupPointList } from '../components/AddressSelector'

// No componente principal
;<AddressTypeTabs
	selectedTab={selectedTab}
	onTabChange={setSelectedTab}
/>

{
	selectedTab === 'delivery' ? (
		<DeliveryAddressList
			addresses={availableAddresses}
			selectedAddress={selectedAddress}
			onAddressSelect={handleAddressSelect}
			onAddNewAddress={handleAddNewAddress}
			isLoading={isLoading}
		/>
	) : (
		<PickupPointList
			pickupPoints={pickupPoints}
			selectedAddress={selectedAddress}
			onPickupPointSelect={handlePickupPointSelect}
			isLoading={isLoading}
		/>
	)
}
```
