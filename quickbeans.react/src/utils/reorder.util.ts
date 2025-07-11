interface ReorderParams<T> {
  list: T[];
  startIndex: number;
  endIndex: number;
}

export const reorder = <T>({ list, startIndex, endIndex }: ReorderParams<T>): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result.map((item, index) => ({
    ...item,
    order: index // Update the order based on the new index
  }));
};
