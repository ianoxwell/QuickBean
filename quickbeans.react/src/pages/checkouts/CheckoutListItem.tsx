import { Card, Flex, Image, Stack, Text } from '@mantine/core';
import { ICheckoutShort } from '@models/checkout.dto';

const CheckoutListItem = ({ checkoutShort }: { checkoutShort: ICheckoutShort }) => {
  return (
    <Card pb={0}>
      <Flex direction="row" gap="lg">
        <Card.Section w="20%">
          <Image src={checkoutShort.heroImage} alt={checkoutShort.name} h="10rem" w="100%" />
        </Card.Section>
        <Stack gap="xs" p="md" w="100%">
          <h2>{checkoutShort.name}</h2>
          <Text>{checkoutShort.slug}</Text>
        </Stack>
      </Flex>
    </Card>
  );
};

export default CheckoutListItem;
