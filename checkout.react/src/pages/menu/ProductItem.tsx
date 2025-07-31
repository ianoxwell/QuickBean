import { CRoutes } from '@app/routes.const';
import { useCheckoutNavigate } from '@app/useCheckoutNavigate';
import { Card, Flex, Image, UnstyledButton } from '@mantine/core';
import { IProduct } from '@models/products.dto';
import { fixWholeNumber } from '@utils/numberUtils';

const ProductItem = ({ product }: { product: IProduct }) => {
  const navigate = useCheckoutNavigate();

  const navigateToProduct = () => {
    navigate(`${CRoutes.menu}/${product.id}`, { state: { product } });
  };

  return (
    <UnstyledButton onClick={navigateToProduct}>
      <Card radius="md" padding="sm" className="product-item">
        <Flex justify="space-between">
          <Flex gap="xs" direction="column" justify="space-between" style={{ flex: 1 }}>
            <div>
              <h3 className="product-item__title">{product.name}</h3>
              <p className="product-item__description">{product.description}</p>
            </div>
            <div className="product-item__price">
              <span>From - </span>${fixWholeNumber(product.baseCost, 2)}
            </div>
          </Flex>
          <Card.Section className="product-image">
            <Image src={product.imageUrl} alt={product.name} />
          </Card.Section>
        </Flex>
      </Card>
    </UnstyledButton>
  );
};

export default ProductItem;
