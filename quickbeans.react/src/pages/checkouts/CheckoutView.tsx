import Swatch from '@components/Swatch/Swatch.component';
import { Flex, Image, InputLabel, List, Stack, Text } from '@mantine/core';
import { ICheckout } from '@models/checkout.dto';

const CheckoutView = ({ checkout }: { checkout: ICheckout }) => {
  return (
    <Flex gap="md" direction={{ base: 'column', sm: 'row' }}>
      <Stack gap="md" flex={1}>
        <div>
          <InputLabel>Title:</InputLabel>
          <Text>{checkout.name}</Text>
        </div>
        <div>
          <InputLabel>Description:</InputLabel>
          <Text>{checkout.description}</Text>
        </div>
        <div>
          <Flex gap="xs" align="center">
            <InputLabel>Slug:</InputLabel>
            <Text c="dimmed" size="sm">
              (Unique string used in the URL of checkout)
            </Text>
          </Flex>
          <Text>{checkout.slug}</Text>
        </div>
        <div>
          <InputLabel>Checkout URL:</InputLabel>
          <Text>{checkout.checkoutUrl}</Text>
        </div>
        <div>
          <InputLabel>Hero Image:</InputLabel>
          <Image src={checkout.heroImage} alt={checkout.name} w="50%" h={200} radius="md" mb="md" />
        </div>
        <div>
          <Flex gap="xs" align="center">
            <InputLabel>Hero Image Text Color:</InputLabel>
            <Text c="dimmed" size="sm">
              (Used for text color to show on the hero image)
            </Text>
          </Flex>
          <Flex gap="xs" align="center">
            <Swatch backgroundColor={checkout.heroImageTextColor} />
            <Text>{checkout.heroImageTextColor}</Text>
          </Flex>
        </div>
        <div>
          <InputLabel>Categories:</InputLabel>
          {checkout.categories && checkout.categories.length > 0 ? (
            [...checkout.categories]
              .sort((a, b) => a.order - b.order)
              .map((category) => (
                <section key={category.id}>
                  <Text mb={4} fw={500}>
                    {category.name}
                  </Text>
                  {category.products && category.products.length > 0 ? (
                    <List mb="md">
                      {category.products.map((product, index) => (
                        <List.Item key={`${product.id}-${index}`}>{product.name}</List.Item>
                      ))}
                    </List>
                  ) : (
                    <Text c="dimmed">No products current in this category</Text>
                  )}
                </section>
              ))
          ) : (
            <Text c="dimmed">No categories available</Text>
          )}
        </div>
      </Stack>
    </Flex>
  );
};

export default CheckoutView;
