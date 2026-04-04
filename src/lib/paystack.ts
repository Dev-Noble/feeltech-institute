/**
 * Paystack Integration Helper
 * Feeltech Marketplace
 */

export const initializePaystack = async (
  email: string,
  amount: number,
  metadata: any,
  onSuccess: (reference: string) => void,
  onClose: () => void
) => {
  // @ts-ignore
  const handler = window.PaystackPop.setup({
    key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    email: email,
    amount: amount * 100, // Paystack works in kobo/cents
    currency: "NGN", // or USD depending on account
    ref: "FT-" + Math.floor(Math.random() * 1000000000 + 1),
    metadata: metadata,
    callback: function (response: any) {
      onSuccess(response.reference);
    },
    onClose: function () {
      onClose();
    },
  });
  
  handler.openIframe();
};
