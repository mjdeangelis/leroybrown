export const generateReceiptDescription = (
  productName: string,
  isRegisteringTeammate: boolean
) => {
  const quantityText = isRegisteringTeammate ? "- Team" : "- Individual";
  return `${productName} ${quantityText}`;
};
