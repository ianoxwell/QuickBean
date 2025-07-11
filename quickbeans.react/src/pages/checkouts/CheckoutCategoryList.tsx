import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { ICheckoutCategory, ICheckoutCategoryWithProducts } from '@models/checkout-category.dto';
import { reorder } from 'src/utils/reorder.util';
import CheckoutCategoryItem from './CheckoutCategoryItem';
import { useCheckoutFormContext } from './checkoutFormContext';

const CheckoutCategoryList = () => {
  const form = useCheckoutFormContext();
  const categories = form.getValues().categories || [];

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) {
      return;
    }

    const reorderedCategories = reorder<ICheckoutCategoryWithProducts>({
      list: categories,
      startIndex: source.index,
      endIndex: destination.index
    });

    form.setFieldValue('categories', reorderedCategories);
  };

  const removeCategory = (index: number) => {
    const updatedCategories = [...categories];
    updatedCategories.splice(index, 1);
    form.setFieldValue('categories', updatedCategories);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="categories">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {categories.map((category: ICheckoutCategory, index: number) => (
              <Draggable
                key={`${category.productType}-${category.id}`}
                draggableId={`${category.productType}-${category.id}`}
                index={index}
              >
                {(draggableProvided) => (
                  <div ref={draggableProvided.innerRef} {...draggableProvided.draggableProps}>
                    <CheckoutCategoryItem
                      index={index}
                      category={category}
                      onRemove={removeCategory}
                      dragHandleProps={draggableProvided.dragHandleProps}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default CheckoutCategoryList;
