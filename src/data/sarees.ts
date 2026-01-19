export interface Saree {
  id: string;
  name: string;
  category: "paithani-silk" | "bunglori-silk" | "embroidery-fancy" | "zarkar" | "print" | "wedding" | "party-wear" | "daily-use";

  description: string;
  image: string;
  fabric: string;
  color: string;
  work: string;
  isNew?: boolean;
}

export const sarees: Saree[] = [
  // Paithani Silk
  {
    id: "paithani-1",
    name: "Traditional Paithani Silk Saree",
    category: "paithani-silk",
    description:
      "Authentic Paithani silk saree with peacock motifs and rich zari border.",
    image: "/src/assets/silk-saree-1.jpg",
    fabric: "Pure Paithani Silk",
    color: "Royal Purple",
    work: "Traditional Zari Work with Peacock Motifs",
    isNew: true,
  },
  {
    id: "paithani-2",
    name: "Maharani Paithani Silk",
    category: "paithani-silk",
    description:
      "Exquisite Paithani with intricate pallu design and traditional patterns.",
    image: "/src/assets/bridal-saree-1.jpg",
    fabric: "Pure Paithani Silk",
    color: "Magenta Pink",
    work: "Heavy Zari Border with Traditional Motifs",
  },
  {
    id: "paithani-3",
    name: "Classic Paithani Heritage",
    category: "paithani-silk",
    description:
      "Heritage Paithani saree with traditional border and exquisite craftsmanship.",
    image: "/src/assets/designer-saree-1.jpg",
    fabric: "Pure Paithani Silk",
    color: "Deep Green",
    work: "Handwoven Zari with Lotus Motifs",
  },
  {
    id: "paithani-4",
    name: "Regal Paithani Silk",
    category: "paithani-silk",
    description:
      "Stunning Paithani with rich colors and traditional weaving techniques.",
    image: "/src/assets/cotton-saree-1.jpg",
    fabric: "Pure Paithani Silk",
    color: "Golden Yellow",
    work: "Traditional Peacock and Floral Motifs",
  },

  // Bunglori Silk
  {
    id: "bunglori-1",
    name: "Elegant Bunglori Silk Saree",
    category: "bunglori-silk",
    description:
      "Soft and lustrous Bunglori silk with beautiful drape and sheen.",
    image: "/src/assets/designer-saree-1.jpg",
    fabric: "Bunglori Silk",
    color: "Navy Blue",
    work: "Contrast Border with Floral Patterns",
    isNew: true,
  },
  {
    id: "bunglori-2",
    name: "Premium Bunglori Silk",
    category: "bunglori-silk",
    description:
      "Rich Bunglori silk with elegant design and comfortable fabric.",
    image: "/src/assets/silk-saree-1.jpg",
    fabric: "Bunglori Silk",
    color: "Teal Green",
    work: "Zari Border with Stone Work",
  },
  {
    id: "bunglori-3",
    name: "Luxury Bunglori Silk Saree",
    category: "bunglori-silk",
    description:
      "Premium quality Bunglori silk with contemporary design elements.",
    image: "/src/assets/bridal-saree-1.jpg",
    fabric: "Bunglori Silk",
    color: "Royal Purple",
    work: "Embroidered Border with Zari",
  },
  {
    id: "bunglori-4",
    name: "Trendy Bunglori Collection",
    category: "bunglori-silk",
    description: "Modern Bunglori silk saree with beautiful texture and shine.",
    image: "/src/assets/cotton-saree-1.jpg",
    fabric: "Bunglori Silk",
    color: "Cherry Red",
    work: "Contrast Border with Sequin Work",
  },

  // Embroidery Fancy
  {
    id: "embroidery-1",
    name: "Designer Embroidery Saree",
    category: "embroidery-fancy",
    description:
      "Fancy saree with heavy embroidery work and contemporary design.",
    image: "/src/assets/designer-saree-1.jpg",
    fabric: "Georgette",
    color: "Wine Red",
    work: "Thread Embroidery with Sequins",
    isNew: true,
  },
  {
    id: "embroidery-2",
    name: "Royal Embroidered Fancy Saree",
    category: "embroidery-fancy",
    description: "Luxurious embroidered saree perfect for grand celebrations.",
    image: "/src/assets/bridal-saree-1.jpg",
    fabric: "Net with Silk",
    color: "Golden Beige",
    work: "Heavy Embroidery with Pearl Work",
  },
  {
    id: "embroidery-3",
    name: "Elegant Fancy Embroidery",
    category: "embroidery-fancy",
    description:
      "Stunning fancy saree with intricate embroidery and modern appeal.",
    image: "/src/assets/silk-saree-1.jpg",
    fabric: "Chiffon",
    color: "Ocean Blue",
    work: "Thread and Stone Embroidery",
  },
  {
    id: "embroidery-4",
    name: "Premium Embroidered Collection",
    category: "embroidery-fancy",
    description: "Designer fancy saree with artistic embroidery patterns.",
    image: "/src/assets/cotton-saree-1.jpg",
    fabric: "Georgette with Silk",
    color: "Mint Green",
    work: "Heavy Thread Work with Cutdana",
  },

  // Zarkar Saree
  {
    id: "zarkar-1",
    name: "Traditional Zarkar Saree",
    category: "zarkar",
    description: "Beautiful Zarkar saree with intricate zari work throughout.",
    image: "/src/assets/silk-saree-1.jpg",
    fabric: "Zarkar Silk",
    color: "Maroon",
    work: "All Over Zari Work",
    isNew: true,
  },
  {
    id: "zarkar-2",
    name: "Premium Zarkar Silk",
    category: "zarkar",
    description: "Stunning Zarkar saree with rich texture and elegant finish.",
    image: "/src/assets/bridal-saree-1.jpg",
    fabric: "Zarkar Silk",
    color: "Emerald Green",
    work: "Gold Zari with Traditional Patterns",
  },
  {
    id: "zarkar-3",
    name: "Exquisite Zarkar Design",
    category: "zarkar",
    description:
      "Beautiful Zarkar saree with detailed zari weaving and fine finish.",
    image: "/src/assets/designer-saree-1.jpg",
    fabric: "Zarkar Silk",
    color: "Royal Blue",
    work: "Silver Zari with Floral Motifs",
  },
  {
    id: "zarkar-4",
    name: "Heritage Zarkar Collection",
    category: "zarkar",
    description: "Traditional Zarkar saree with opulent zari work throughout.",
    image: "/src/assets/cotton-saree-1.jpg",
    fabric: "Zarkar Silk",
    color: "Burgundy",
    work: "All Over Gold Zari Weaving",
  },

  // Print Saree
  {
    id: "print-1",
    name: "Floral Print Saree",
    category: "print",
    description: "Beautiful printed saree with vibrant floral patterns.",
    image: "/src/assets/cotton-saree-1.jpg",
    fabric: "Georgette",
    color: "Coral Pink",
    work: "Digital Print with Contrast Border",
    isNew: true,
  },
  {
    id: "print-2",
    name: "Contemporary Print Saree",
    category: "print",
    description: "Modern printed design perfect for parties and events.",
    image: "/src/assets/designer-saree-1.jpg",
    fabric: "Crepe",
    color: "Turquoise Blue",
    work: "Abstract Print with Sequin Border",
  },
  {
    id: "print-3",
    name: "Artistic Print Collection",
    category: "print",
    description: "Stylish printed saree with trendy patterns and colors.",
    image: "/src/assets/silk-saree-1.jpg",
    fabric: "Georgette",
    color: "Lavender Purple",
    work: "Digital Floral Print with Lace",
  },
  {
    id: "print-4",
    name: "Modern Print Saree",
    category: "print",
    description: "Chic printed saree with contemporary design aesthetic.",
    image: "/src/assets/bridal-saree-1.jpg",
    fabric: "Crepe Silk",
    color: "Peach Orange",
    work: "Geometric Print with Embellished Border",
  },

  // Wedding Saree
  {
    id: "wedding-1",
    name: "Grand Wedding Saree",
    category: "wedding",
    description:
      "Majestic wedding saree with heavy embellishments and rich fabric.",
    image: "/src/assets/bridal-saree-1.jpg",
    fabric: "Premium Silk",
    color: "Bridal Red",
    work: "Heavy Zari with Kundan Work",
    isNew: true,
  },
  {
    id: "wedding-2",
    name: "Royal Wedding Collection",
    category: "wedding",
    description: "Opulent wedding saree for the most special day of your life.",
    image: "/src/assets/silk-saree-1.jpg",
    fabric: "Banarasi Silk",
    color: "Deep Maroon",
    work: "Traditional Zari with Stone Embellishments",
  },
  {
    id: "wedding-3",
    name: "Bridal Heritage Saree",
    category: "wedding",
    description:
      "Magnificent wedding saree with traditional craftsmanship and luxury.",
    image: "/src/assets/designer-saree-1.jpg",
    fabric: "Kanjivaram Silk",
    color: "Ruby Red",
    work: "Gold Zari with Diamond Work",
  },
  {
    id: "wedding-4",
    name: "Premium Wedding Ensemble",
    category: "wedding",
    description:
      "Exquisite bridal saree with intricate details for your big day.",
    image: "/src/assets/cotton-saree-1.jpg",
    fabric: "Premium Silk Blend",
    color: "Crimson Red",
    work: "Heavy Embroidery with Kundan and Pearls",
  },

  // Party Wear
  {
    id: "party-1",
    name: "Glamorous Party Wear Saree",
    category: "party-wear",
    description: "Stylish party wear saree with modern design and shimmer.",
    image: "/src/assets/designer-saree-1.jpg",
    fabric: "Satin Silk",
    color: "Black with Gold",
    work: "Sequin Work with Embroidery",
    isNew: true,
  },
  {
    id: "party-2",
    name: "Trendy Party Saree",
    category: "party-wear",
    description: "Contemporary party wear with elegant drape and shine.",
    image: "/src/assets/silk-saree-1.jpg",
    fabric: "Lycra Blend",
    color: "Midnight Blue",
    work: "Glitter Work with Crystal Border",
  },
  {
    id: "party-3",
    name: "Chic Party Wear Collection",
    category: "party-wear",
    description:
      "Fashionable party saree with sparkling details and modern style.",
    image: "/src/assets/bridal-saree-1.jpg",
    fabric: "Satin Georgette",
    color: "Rose Gold",
    work: "Sequin and Thread Embroidery",
  },
  {
    id: "party-4",
    name: "Glamour Party Saree",
    category: "party-wear",
    description: "Striking party wear saree for making a statement at events.",
    image: "/src/assets/cotton-saree-1.jpg",
    fabric: "Shimmer Fabric",
    color: "Silver Grey",
    work: "Crystal Work with Metallic Border",
  },

  // Daily Use
  {
    id: "daily-1",
    name: "Comfortable Cotton Saree",
    category: "daily-use",
    description: "Perfect daily wear cotton saree with easy maintenance.",
    image: "/src/assets/cotton-saree-1.jpg",
    fabric: "Pure Cotton",
    color: "Pastel Yellow",
    work: "Simple Border with Print",
    isNew: true,
  },
  {
    id: "daily-2",
    name: "Everyday Wear Saree",
    category: "daily-use",
    description: "Comfortable and elegant saree for daily occasions.",
    image: "/src/assets/cotton-saree-1.jpg",
    fabric: "Cotton Blend",
    color: "Light Blue",
    work: "Block Print with Contrast Border",
  },
  {
    id: "daily-3",
    name: "Simple Cotton Saree",
    category: "daily-use",
    description: "Easy-to-wear cotton saree perfect for daily activities.",
    image: "/src/assets/silk-saree-1.jpg",
    fabric: "Pure Cotton",
    color: "Mint Green",
    work: "Printed Border with Simple Design",
  },
  {
    id: "daily-4",
    name: "Casual Wear Cotton Saree",
    category: "daily-use",
    description: "Practical and stylish cotton saree for everyday elegance.",
    image: "/src/assets/designer-saree-1.jpg",
    fabric: "Cotton Blend",
    color: "Beige",
    work: "Traditional Print with Woven Border",
  },
];

export const collections = [
  {
    id: "paithani-silk",
    name: "Paithani Silk",
    description: "Authentic Paithani silk sarees with traditional motifs",
    image: "/src/assets/silk-saree-1.jpg",
  },
  {
    id: "bunglori-silk",
    name: "Bunglori Silk",
    description: "Soft and lustrous Bunglori silk with elegant drape",
    image: "/src/assets/designer-saree-1.jpg",
  },
  {
    id: "embroidery-fancy",
    name: "Embroidery Fancy",
    description: "Designer sarees with heavy embroidery work",
    image: "/src/assets/designer-saree-1.jpg",
  },
  {
    id: "zarkar",
    name: "Zarkar Saree",
    description: "Traditional Zarkar sarees with rich zari work",
    image: "/src/assets/silk-saree-1.jpg",
  },
  {
    id: "print",
    name: "Print Saree",
    description: "Vibrant printed sarees with contemporary designs",
    image: "/src/assets/cotton-saree-1.jpg",
  },
  {
    id: "wedding",
    name: "Wedding Saree",
    description: "Grand wedding collection for your special day",
    image: "/src/assets/bridal-saree-1.jpg",
  },
  {
    id: "party-wear",
    name: "Party Wear Saree",
    description: "Glamorous party wear with modern styling",
    image: "/src/assets/designer-saree-1.jpg",
  },
  {
    id: "daily-use",
    name: "Daily Use Saree",
    description: "Comfortable cotton sarees for everyday wear",
    image: "/src/assets/cotton-saree-1.jpg",
  },
];
