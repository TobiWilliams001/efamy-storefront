# Managing products

A guide for whoever keeps the shop up to date. No technical knowledge needed.

## Signing in

Go to the Studio address you were given (it ends in `.sanity.studio`) and sign
in with the email you were invited on.

Changes are **live within a minute**. There is no separate publish-to-website
step and nobody needs to redeploy anything.

## The two things you can edit

**Categories** — the groups products sit in, such as Chilli Sauces.

**Products** — the jars themselves.

Everything else on the website (page wording, the About page, questions and
answers) is in the code and needs a developer.

## Before your first product

**Create the categories first.** Every product must belong to one, so if the
categories do not exist yet you will not be able to save.

## Adding a product

Click **Product → Create new**. The form is in three tabs.

### Details

| Field             | What to put                                                    |
| ----------------- | -------------------------------------------------------------- |
| Name              | Exactly as on the jar, e.g. `Beef Chilli Sauce — Hot`          |
| Slug              | Click **Generate**. This becomes the web address               |
| Summary           | One short line for the product grid, under 80 characters       |
| Description       | A short paragraph. What it tastes like and what to eat it with |
| Sizes and prices  | One row per size on sale. See below                            |
| Category          | Pick one                                                       |
| Heat              | Mild or Hot. Leave empty if the jar is not labelled either     |
| Main image        | The photo on a white background                                |
| Additional images | Other angles. Optional                                         |
| Best paired with  | Dishes it goes with, one per box                               |

### Sizes and prices

Add one row per size you sell. A sauce usually has four; a seasoning usually one.

**Prices are in pence.** This catches everyone out:

| You want | You type |
| -------- | -------- |
| £3.25    | `325`    |
| £4.75    | `475`    |
| £12.50   | `1250`   |

The website shows "from" the cheapest size, and the customer picks a size before
adding to the basket.

Untick **In stock** on a single size to stop that one selling while the others
carry on.

### Label information

This is the tab that matters most, and the one to be careful with.

**Ingredients** — copy from the jar exactly, one per box.

**Allergens** — for example `Fish`, `Wheat (gluten)`.

**Never guess either of these.** Wrong allergen information on food is a safety
issue and a legal one. If you cannot read the label, leave it blank and check
the jar. Blank is safe; wrong is not.

**Storage** — copy the wording from the jar.

**Nutrition** — optional, per 100g. Only from the label.

**Dietary claims** — only what is printed, such as `Suitable for vegans`.

### Merchandising

| Setting              | What it does                                                 |
| -------------------- | ------------------------------------------------------------ |
| Show "New" badge     | Adds a New label on the product card                         |
| Show in Featured     | Puts it in the Featured row on the homepage                  |
| Show in Best sellers | Puts it in the Best sellers row                              |
| Sort order           | Lower numbers appear first. Leave blank and it sorts by name |

Aim for four products in Featured and four in Best sellers. Try not to put the
same product in both, or the homepage repeats itself.

## Editing a product

Open it, change what you need. Changes save automatically and appear on the site
within a minute.

**Changing the slug breaks existing links.** Anyone who bookmarked or shared the
old address gets a Not Found page, and search engines lose the page. Avoid it
once a product is live.

## Taking a product off sale

Untick **In stock** on every size. It stays on the site marked out of stock,
which keeps the link working and the search ranking intact.

Only delete a product if it never existed. Deleting breaks the link permanently.

## Images

- White background for product photos
- Roughly square, at least 1000px
- **Alternative text is required.** Describe the product for people using screen
  readers and for search engines. `Jar of Efamy beef chilli sauce, hot` is right;
  `image1` is not

## If something looks wrong on the site

The website keeps a built-in copy of the products as a safety net. If the CMS is
unreachable, the site shows that copy instead of breaking.

So if an edit does not appear:

1. Wait a minute and refresh
2. Check the product actually saved in the Studio
3. If the site shows old information for several minutes, tell your developer

## Getting help

Note what you were editing and what you expected. If a field will not save,
there is usually a red message under it explaining why.
