export type Faq = {
  question: string;
  answer: string;
};

/**
 * Only questions we can answer truthfully from the packaging and the range.
 * Delivery costs, timescales and returns windows are deliberately absent until
 * the client confirms them: a wrong answer here becomes a customer dispute.
 */
export const faqs: Faq[] = [
  {
    question: "What is the difference between mild and hot?",
    answer:
      "The recipe underneath is the same. The mild version simply carries less chilli, so you get the full depth of flavour with a gentler heat. It means a table with different tastes can share the same meal.",
  },
  {
    question: "Where are your products made?",
    answer:
      "Efamy is a Ghanaian food brand and every jar is produced in the UK, using traditional recipes.",
  },
  {
    question: "Do your products contain artificial preservatives?",
    answer:
      "No. Our chilli sauces and seasoning mixes are made without artificial preservatives, and the ingredient lists are kept short and readable.",
  },
  {
    question: "Are any of your products suitable for vegetarians or vegans?",
    answer:
      "Our Beans Chilli Sauce is labelled suitable for vegetarians and vegans. The beef, chicken, fish and pork sauces are not. Always check the label on the jar you receive.",
  },
  {
    question: "How do I store a jar once it is opened?",
    answer:
      "Store unopened jars in a cool, dry place. Once opened, refrigerate and use within four weeks. The exact guidance is printed on each jar, so follow the label on the product you have.",
  },
  {
    question: "Do your products contain allergens?",
    answer:
      "Our fish sauces contain fish, and Coat & Cook contains wheat (gluten). Ingredients and allergens are listed on every product page, but always check the label on the jar you receive before eating.",
  },
  {
    question: "What can I use the seasoning mixes for?",
    answer:
      "The All Purpose Seasoning Mix works across meat, fish and chicken. The Kelewele mix is for spiced fried plantain. Coat & Cook gives a crisp coating for chicken, fish, meat and vegetables.",
  },
  {
    question: "Can I stock Efamy in my shop?",
    answer:
      "Yes. We supply independent retailers, grocers and food shops across the UK, with no minimum shelf space. Get in touch and we will send you trade pricing and case quantities.",
  },
];

export const productFaqs: Faq[] = faqs.filter((faq) =>
  [
    "What is the difference between mild and hot?",
    "How do I store a jar once it is opened?",
    "Do your products contain allergens?",
    "Where are your products made?",
  ].includes(faq.question),
);

/** The questions people email about, answered before they have to. */
export const contactFaqs: Faq[] = faqs.filter((faq) =>
  [
    "Can I stock Efamy in my shop?",
    "Do your products contain allergens?",
    "What is the difference between mild and hot?",
    "How do I store a jar once it is opened?",
  ].includes(faq.question),
);
