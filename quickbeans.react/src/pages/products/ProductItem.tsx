import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import { Badge, Button, Card, Group, Image, Text } from '@mantine/core';
import { IProductShort } from '@models/products.dto';
import { convertProductType } from '@utils/stringUtils';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const ProductItem = ({ product }: { product: IProductShort }) => {
  const base = import.meta.env.VITE_BASE_URL;
  const venueState = useSelector((store: RootState) => store.venue);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image src={product.imageUrl} height={160} alt={product.name} />
      </Card.Section>
      <Group justify="space-between" mt="md">
        <Text fw={500} size="lg">
          {product.name}
        </Text>
        <Badge color="blue.8">{convertProductType(product.productType)}</Badge>
      </Group>
      <Text lineClamp={1} size="sm" c="dimmed">
        {product.description || 'No description available.'}
      </Text>
      <Button
        component={Link}
        to={`${base}${venueState.slug}/${CRoutes.products}/${product.id}`}
        fullWidth
        mt="md"
        radius="md"
      >
        View Details
      </Button>
    </Card>
  );
};

export default ProductItem;
