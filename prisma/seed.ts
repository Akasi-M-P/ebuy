import { PrismaClient, ProductStatus, OrderStatus, PaymentStatus, CouponType, CouponStatus } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // ─── Categories ────────────────────────────────────────────────────────────

  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'smartphones' }, update: {}, create: { name: 'Smartphones', slug: 'smartphones', image: '/assets/heroimage1.jpg', description: 'Premium mobile devices crafted for the discerning user.', productCount: 8 } }),
    prisma.category.upsert({ where: { slug: 'laptops' },     update: {}, create: { name: 'Laptops',     slug: 'laptops',     image: '/assets/heroimage2.jpg', description: 'High-performance computing for professionals.',        productCount: 6 } }),
    prisma.category.upsert({ where: { slug: 'audio' },       update: {}, create: { name: 'Audio',       slug: 'audio',       image: '/assets/heroimage3.png', description: 'Immersive sound experiences for audiophiles.',          productCount: 10 } }),
    prisma.category.upsert({ where: { slug: 'gaming' },      update: {}, create: { name: 'Gaming',      slug: 'gaming',      image: '/assets/heroimage4.jpg', description: 'Elite gear engineered for peak performance.',           productCount: 7 } }),
  ])
  console.log(`✓ ${categories.length} categories`)

  // ─── Auth users ────────────────────────────────────────────────────────────

  const adminPassword    = await hash('admin123',    10)
  const customerPassword = await hash('password123', 10)

  const adminUser = await prisma.user.upsert({
    where:  { email: 'admin@ebuy.com' },
    update: {},
    create: { name: 'Admin User', email: 'admin@ebuy.com', password: adminPassword, role: 'admin' },
  })
  const janeUser = await prisma.user.upsert({
    where:  { email: 'jane@example.com' },
    update: {},
    create: { name: 'Jane Smith', email: 'jane@example.com', password: customerPassword, role: 'customer' },
  })
  await prisma.user.upsert({
    where:  { email: 'customer@example.com' },
    update: {},
    create: { name: 'John Doe', email: 'customer@example.com', password: customerPassword, role: 'customer' },
  })

  // ─── Customer users (for orders) ────────────────────────────────────────────

  const cust1 = await prisma.user.upsert({ where: { email: 'alex.mitchell@example.com' }, update: {}, create: { name: 'Alexandra Mitchell', email: 'alex.mitchell@example.com', phone: '+1 555 0101', role: 'customer' } })
  const cust2 = await prisma.user.upsert({ where: { email: 'j.harrington@example.com'  }, update: {}, create: { name: 'James Harrington',   email: 'j.harrington@example.com',  phone: '+44 20 7946 0958', role: 'customer' } })
  const cust3 = await prisma.user.upsert({ where: { email: 'sofia.b@example.com'        }, update: {}, create: { name: 'Sofia Blanc',         email: 'sofia.b@example.com',        phone: '+33 1 40 00 00 00', role: 'customer' } })
  const cust4 = await prisma.user.upsert({ where: { email: 'k.watanabe@example.com'     }, update: {}, create: { name: 'Kenji Watanabe',      email: 'k.watanabe@example.com',     phone: '+81 3 1234 5678', role: 'customer' } })
  await prisma.user.upsert({ where: { email: 'priya.s@example.com'  }, update: {}, create: { name: 'Priya Sharma',  email: 'priya.s@example.com',  phone: '+91 98 7654 3210', role: 'customer' } })
  await prisma.user.upsert({ where: { email: 'luca.f@example.com'   }, update: {}, create: { name: 'Luca Ferrari',  email: 'luca.f@example.com',   phone: '+39 02 1234 5678', role: 'customer' } })

  console.log('✓ Users seeded')

  // ─── Products ──────────────────────────────────────────────────────────────

  const s22 = await prisma.product.upsert({
    where:  { slug: 'samsung-galaxy-s22' },
    update: {},
    create: {
      slug: 'samsung-galaxy-s22', name: 'Samsung Galaxy S22', brand: 'Samsung',
      category: 'Smartphones', categorySlug: 'smartphones',
      images: ['/assets/s22.png', '/assets/heroimage1.jpg'],
      price: 1599, compareAtPrice: 1899,
      shortDescription: 'The Galaxy S22 redefines mobile photography with its expert RAW camera and Dynamic AMOLED display.',
      description: 'Experience the pinnacle of mobile innovation with the Samsung Galaxy S22. Featuring a stunning 6.1" Dynamic AMOLED 2X display with a 120Hz adaptive refresh rate, the S22 adapts to whatever you are doing for an incredibly smooth experience. The new Expert RAW camera system captures detail in any light, while the Snapdragon 8 Gen 1 processor ensures lightning-fast performance for everything you demand.',
      details: ['Display: 6.1" Dynamic AMOLED 2X, 120Hz', 'Processor: Snapdragon 8 Gen 1', 'RAM: 8GB | Storage: 256GB', 'Camera: 50MP Wide + 12MP Ultra-wide + 10MP Telephoto', 'Battery: 3700mAh with 25W fast charging', 'OS: Android 12 | One UI 4.1', 'Colors: Phantom Black, Phantom White, Green, Pink Gold'],
      careInstructions: ['IP68 water and dust resistance rating', 'Use a soft, lint-free cloth for cleaning', 'Avoid exposing to extreme temperatures'],
      shippingInfo: 'Free express shipping. Delivered within 2–4 business days.',
      box: ['Samsung Galaxy S22', 'USB-C Cable', 'SIM Ejector Tool', 'Quick Start Guide'],
      tags: ['smartphone', 'samsung', '5g', 'android'],
      rating: 4.7, reviewCount: 284, stock: 38, sku: 'SAM-S22-MAIN', weight: 168,
      isNew: true, isFeatured: true, status: ProductStatus.active,
      createdAt: new Date('2024-01-01'),
      variants: { create: [
        { color: 'Phantom Black', colorHex: '#1A1A1A', stock: 15, sku: 'S22-BLK-256', size: '256GB' },
        { color: 'Phantom White', colorHex: '#F0F0F0', stock: 10, sku: 'S22-WHT-256', size: '256GB' },
        { color: 'Green',         colorHex: '#4A7C59', stock: 5,  sku: 'S22-GRN-256', size: '256GB' },
        { color: 'Pink Gold',     colorHex: '#C9956A', stock: 8,  sku: 'S22-PNK-256', size: '256GB' },
      ]},
      reviews: { create: [
        { author: 'Alexandra M.', location: 'New York, USA',     rating: 5, title: 'Absolutely stunning device',  body: 'The camera quality is exceptional — night shots look like they were taken with a professional DSLR. The build quality feels genuinely premium in hand.', verified: true, createdAt: new Date('2024-03-15') },
        { author: 'James K.',     location: 'London, UK',        rating: 4, title: 'Near-perfect flagship',       body: 'Battery life could be better, but everything else is flawless. Display is the best I have ever seen on a smartphone.', verified: true, createdAt: new Date('2024-02-28') },
        { author: 'Sophie L.',    location: 'Paris, France',     rating: 5, title: 'Worth every penny',           body: 'I upgraded from an S20 and the difference is night and day. The performance is buttery smooth and I love the new camera system.', verified: true, createdAt: new Date('2024-01-10') },
      ]},
    },
  })

  const victus = await prisma.product.upsert({
    where:  { slug: 'hp-victus-gaming-laptop' },
    update: {},
    create: {
      slug: 'hp-victus-gaming-laptop', name: 'HP Victus Gaming Laptop', brand: 'HP',
      category: 'Laptops', categorySlug: 'laptops',
      images: ['/assets/victuslaptop.png', '/assets/heroimage2.jpg'],
      price: 1799,
      shortDescription: 'Dominate every game with the HP Victus — RTX graphics, AMD Ryzen power, and a 144Hz display.',
      description: 'The HP Victus Gaming Laptop is engineered for serious gamers who demand uncompromised performance. Powered by the AMD Ryzen 7 7745HX processor and NVIDIA GeForce RTX 4060 graphics, it handles the most demanding titles with ease.',
      details: ['Display: 15.6" FHD IPS, 144Hz', 'Processor: AMD Ryzen 7 7745HX', 'GPU: NVIDIA GeForce RTX 4060 8GB', 'RAM: 16GB DDR5 | Storage: 512GB NVMe SSD', 'Battery: 70Wh with fast charging', 'OS: Windows 11 Home', 'Ports: USB-A × 3, USB-C, HDMI 2.1, RJ-45'],
      careInstructions: [],
      shippingInfo: 'Free express shipping. Delivered within 3–5 business days.',
      box: ['HP Victus Laptop', '150W Power Adapter', 'Documentation Pack'],
      tags: ['laptop', 'gaming', 'rtx', 'amd', 'hp'],
      rating: 4.5, reviewCount: 156, stock: 19, sku: 'HP-VICTUS-MAIN', weight: 2100,
      isNew: false, isFeatured: true, status: ProductStatus.active,
      createdAt: new Date('2024-01-15'),
      variants: { create: [
        { color: 'Mica Silver',       colorHex: '#C0C0C0', stock: 12, sku: 'VICTUS-SLV-512' },
        { color: 'Performance Blue',  colorHex: '#1E3A5F', stock: 7,  sku: 'VICTUS-BLU-512' },
      ]},
      reviews: { create: [
        { author: 'Marcus T.',  location: 'Toronto, Canada',     rating: 5, title: 'Incredible gaming performance',     body: 'Runs AAA titles at ultra settings without breaking a sweat. The 144Hz display is a game-changer — literally.', verified: true, createdAt: new Date('2024-04-02') },
        { author: 'Priya S.',   location: 'Sydney, Australia',   rating: 4, title: 'Great value for the spec sheet',    body: 'Purchased for content creation and gaming. Handles 4K video editing smoothly. Fan noise under full load is noticeable but acceptable.', verified: true, createdAt: new Date('2024-03-18') },
      ]},
    },
  })

  const speakers = await prisma.product.upsert({
    where:  { slug: 'dual-tower-speaker-system' },
    update: {},
    create: {
      slug: 'dual-tower-speaker-system', name: 'Dual Tower Speaker System', brand: 'Resonance Audio',
      category: 'Audio', categorySlug: 'audio',
      images: ['/assets/doublespeaker.png', '/assets/heroimage3.png'],
      price: 2699, compareAtPrice: 3199,
      shortDescription: 'Fill any room with room-filling, studio-grade sound from these precision-engineered tower speakers.',
      description: 'The Resonance Dual Tower Speaker System delivers an uncompromising hi-fi experience. With a 3-way driver configuration, dedicated tweeters, mid-range drivers, and a 10" woofer per tower, you experience music exactly as the artist intended.',
      details: ['Driver configuration: 3-way (tweeter, mid-range, woofer)', 'Frequency response: 28Hz – 40kHz', 'Sensitivity: 91dB @ 1W/1m', 'Impedance: 8 Ohms', 'Power handling: 200W RMS / 400W Peak', 'Dimensions: H: 110cm × W: 28cm × D: 32cm (per tower)', 'Finishes: Satin Black, Walnut Veneer'],
      careInstructions: [],
      shippingInfo: 'White-glove delivery included. Setup service available.',
      box: ['2× Tower Speaker', 'Speaker Cables (3m pair)', 'Isolation Feet', 'Manual'],
      tags: ['speakers', 'hi-fi', 'audio', 'tower', 'stereo'],
      rating: 4.9, reviewCount: 87, stock: 10, sku: 'RESON-TOWER-MAIN', weight: 18000,
      isNew: false, isFeatured: false, status: ProductStatus.active,
      createdAt: new Date('2023-11-20'),
      variants: { create: [
        { color: 'Satin Black',   colorHex: '#1A1A1A', stock: 6, sku: 'RESON-BLK' },
        { color: 'Walnut Veneer', colorHex: '#7D5A3C', stock: 4, sku: 'RESON-WAL' },
      ]},
      reviews: { create: [
        { author: 'Henrik B.',  location: 'Stockholm, Sweden',   rating: 5, title: 'Concert hall in my living room',   body: 'These speakers are extraordinary. The soundstage is wide and deep, vocals are crystal clear, and the bass is tight and controlled. Worth every cent.', verified: true, createdAt: new Date('2024-02-14') },
        { author: 'Claire W.',  location: 'Melbourne, Australia',rating: 5, title: 'Audiophile-grade at a fair price', body: 'I have owned speakers costing three times as much that do not perform as well. The walnut veneer finish is also gorgeous.', verified: true, createdAt: new Date('2024-01-29') },
      ]},
    },
  })

  const headset = await prisma.product.upsert({
    where:  { slug: 'elite-gaming-headset-pro' },
    update: {},
    create: {
      slug: 'elite-gaming-headset-pro', name: 'Elite Gaming Headset Pro', brand: 'Apex Audio',
      category: 'Gaming', categorySlug: 'gaming',
      images: ['/assets/gamingheadphone.png', '/assets/heroimage4.jpg'],
      price: 1799,
      shortDescription: 'Positional 7.1 surround, 50mm planar magnetic drivers, and all-day comfort for elite competitive play.',
      description: "Built for champions who refuse to compromise, the Elite Gaming Headset Pro combines Apex Audio's planar magnetic driver technology with best-in-class 7.1 virtual surround sound.",
      details: ['Drivers: 50mm Planar Magnetic', 'Frequency response: 10Hz – 40kHz', 'Surround: 7.1 Virtual Surround (USB mode)', 'Microphone: Detachable uni-directional, noise-cancelling', 'Connection: USB-A + 3.5mm analog', 'Cable length: 2m braided', 'Weight: 320g'],
      careInstructions: ['Store in the included carry pouch when not in use', 'Clean ear cushions with a slightly damp cloth', 'Avoid bending the headband beyond natural flex range'],
      shippingInfo: 'Free express shipping. Delivered within 2–4 business days.',
      box: ['Elite Gaming Headset', 'Detachable Microphone', 'USB-A Adapter', 'Carry Pouch', '3.5mm Cable'],
      tags: ['headset', 'gaming', '7.1 surround', 'planar magnetic'],
      rating: 4.8, reviewCount: 203, stock: 34, sku: 'APEX-HEADSET-MAIN', weight: 320,
      isNew: true, isFeatured: false, status: ProductStatus.active,
      createdAt: new Date('2024-02-01'),
      variants: { create: [
        { color: 'Midnight Black', colorHex: '#111111', stock: 20, sku: 'APEX-BLK' },
        { color: 'Arctic White',   colorHex: '#F0F0F0', stock: 11, sku: 'APEX-WHT' },
        { color: 'Crimson Red',    colorHex: '#C0392B', stock: 3,  sku: 'APEX-RED' },
      ]},
      reviews: { create: [
        { author: 'DeShawn R.', location: 'Atlanta, USA',   rating: 5, title: 'Best gaming headset I have ever owned', body: 'The positional audio is insane — I can hear exactly where enemies are in games. Mic quality is also studio-level clear.', verified: true, createdAt: new Date('2024-04-10') },
        { author: 'Yuki T.',    location: 'Tokyo, Japan',   rating: 5, title: 'Premium in every way',                 body: 'The planar magnetic drivers are a revelation compared to standard dynamic drivers. Music listening is exceptional too.', verified: true, createdAt: new Date('2024-03-30') },
        { author: 'Fatima A.', location: 'Dubai, UAE',     rating: 4, title: 'Almost perfect',                       body: 'Excellent sound and build quality. Docked one star because the USB dongle is quite large. Otherwise flawless.', verified: true, createdAt: new Date('2024-02-05') },
      ]},
    },
  })

  const s22ultra = await prisma.product.upsert({
    where:  { slug: 'samsung-galaxy-s22-ultra' },
    update: {},
    create: {
      slug: 'samsung-galaxy-s22-ultra', name: 'Samsung Galaxy S22 Ultra', brand: 'Samsung',
      category: 'Smartphones', categorySlug: 'smartphones',
      images: ['/assets/s22.png'],
      price: 2199,
      shortDescription: 'The ultimate S22 with built-in S Pen, 200MP camera, and titanium frame.',
      description: "The Samsung Galaxy S22 Ultra is the pinnacle of the S22 lineup, integrating the legendary S Pen stylus natively into the device. With a 200MP primary camera, quad-lens rear system, and the industry's most powerful mobile processor.",
      details: ['Display: 6.8" Dynamic AMOLED 2X, 120Hz', 'Processor: Snapdragon 8 Gen 1', 'RAM: 12GB | Storage: 512GB', 'Camera: 200MP + 12MP + 10MP × 2', 'Battery: 5000mAh with 45W fast charging', 'S Pen included'],
      careInstructions: [],
      shippingInfo: 'Free express shipping. Delivered within 2–4 business days.',
      box: ['Samsung Galaxy S22 Ultra', 'S Pen', 'USB-C Cable', 'Quick Start Guide'],
      tags: ['smartphone', 'samsung', 's-pen', '5g'],
      rating: 4.9, reviewCount: 421, stock: 22, sku: 'SAM-S22U-MAIN',
      isNew: false, isFeatured: false, status: ProductStatus.active,
      createdAt: new Date('2024-01-05'),
    },
  })

  const earbuds = await prisma.product.upsert({
    where:  { slug: 'apex-wireless-earbuds-pro' },
    update: {},
    create: {
      slug: 'apex-wireless-earbuds-pro', name: 'Apex Wireless Earbuds Pro', brand: 'Apex Audio',
      category: 'Audio', categorySlug: 'audio',
      images: ['/assets/gamingheadphone.png'],
      price: 449, compareAtPrice: 549,
      shortDescription: 'ANC earbuds with 30-hour battery, spatial audio, and an IPX5 rating.',
      description: 'The Apex Wireless Earbuds Pro redefine true wireless audio. Active noise cancellation powered by four microphones eliminates the outside world, while spatial audio creates a three-dimensional soundscape around you.',
      details: ['Driver: 11mm custom dynamic', 'ANC: Adaptive Active Noise Cancellation', 'Battery: 7h + 23h case (30h total)', 'Connectivity: Bluetooth 5.3, multipoint', 'Water resistance: IPX5', 'Charging: USB-C + Qi wireless'],
      careInstructions: [],
      shippingInfo: 'Free express shipping. Delivered within 2–4 business days.',
      box: [],
      tags: ['earbuds', 'wireless', 'anc', 'audio'],
      rating: 4.6, reviewCount: 312, stock: 45, sku: 'APEX-EARBUDS-MAIN',
      isNew: true, isFeatured: false, status: ProductStatus.active,
      createdAt: new Date('2024-03-10'),
    },
  })

  await prisma.product.upsert({
    where:  { slug: 'victus-gaming-laptop-17' },
    update: {},
    create: {
      slug: 'victus-gaming-laptop-17', name: 'HP Victus 17 Gaming Laptop', brand: 'HP',
      category: 'Laptops', categorySlug: 'laptops',
      images: ['/assets/victuslaptop.png'],
      price: 2299,
      shortDescription: 'The 17-inch powerhouse for creators and gamers who want more screen real estate.',
      description: 'More room to create, more room to dominate. The HP Victus 17 brings the same RTX 4070 performance to a larger 17.3" QHD display at 165Hz.',
      details: ['Display: 17.3" QHD IPS, 165Hz', 'Processor: Intel Core i9-13900HX', 'GPU: NVIDIA GeForce RTX 4070 8GB', 'RAM: 32GB DDR5 | Storage: 1TB NVMe SSD', 'Battery: 83Wh'],
      careInstructions: [],
      shippingInfo: 'Free express shipping. Delivered within 3–5 business days.',
      box: [],
      tags: ['laptop', 'gaming', 'rtx', 'intel', '17-inch'],
      rating: 4.4, reviewCount: 98, stock: 8, sku: 'HP-VICTUS17-MAIN',
      isNew: false, isFeatured: false, status: ProductStatus.active,
      createdAt: new Date('2024-02-20'),
    },
  })

  await prisma.product.upsert({
    where:  { slug: 'resonance-bookshelf-speakers' },
    update: {},
    create: {
      slug: 'resonance-bookshelf-speakers', name: 'Resonance Bookshelf Speakers', brand: 'Resonance Audio',
      category: 'Audio', categorySlug: 'audio',
      images: ['/assets/doublespeaker.png'],
      price: 899,
      shortDescription: 'Compact hi-fi speakers with a soundstage that defies their size.',
      description: 'Do not let their size fool you. The Resonance Bookshelf Speakers deliver a full-range soundstage that competes with tower speakers twice their price.',
      details: ['Tweeter: 1" silk dome', 'Woofer: 6.5" long-throw paper cone', 'Frequency response: 45Hz – 40kHz', 'Sensitivity: 88dB @ 1W/1m', 'Power handling: 100W RMS'],
      careInstructions: [],
      shippingInfo: 'Free shipping. Delivered within 3–5 business days.',
      box: [],
      tags: ['speakers', 'hi-fi', 'bookshelf', 'stereo'],
      rating: 4.7, reviewCount: 134, stock: 17, sku: 'RESON-BOOK-MAIN',
      isNew: false, isFeatured: false, status: ProductStatus.active,
      createdAt: new Date('2023-10-01'),
    },
  })

  console.log('✓ Products seeded')

  // ─── Orders ────────────────────────────────────────────────────────────────

  await prisma.order.upsert({
    where:  { orderNumber: '#EB-2024-00142' },
    update: {},
    create: {
      orderNumber: '#EB-2024-00142', customerId: cust1.id,
      customerName: 'Alexandra Mitchell', customerEmail: 'alex.mitchell@example.com',
      subtotal: 1599, shipping: 0, tax: 128, total: 1727,
      status: OrderStatus.delivered, paymentStatus: PaymentStatus.paid,
      paymentMethod: 'Visa •••• 4242',
      shippingAddress: { fullName: 'Alexandra Mitchell', email: 'alex@example.com', phone: '+1 555 0101', address1: '142 Park Avenue', city: 'New York', state: 'NY', zip: '10022', country: 'United States' },
      trackingNumber: 'UPS1Z9284AB1', carrier: 'UPS',
      createdAt: new Date('2024-04-01'), updatedAt: new Date('2024-04-05'),
      items: { create: [{ productId: s22.id, name: 'Samsung Galaxy S22', image: '/assets/s22.png', price: 1599, quantity: 1, sku: 'S22-BLK-256' }] },
    },
  })

  await prisma.order.upsert({
    where:  { orderNumber: '#EB-2024-00141' },
    update: {},
    create: {
      orderNumber: '#EB-2024-00141', customerId: cust2.id,
      customerName: 'James Harrington', customerEmail: 'j.harrington@example.com',
      subtotal: 3598, shipping: 0, tax: 288, total: 3886,
      status: OrderStatus.shipped, paymentStatus: PaymentStatus.paid,
      paymentMethod: 'Mastercard •••• 8871',
      shippingAddress: { fullName: 'James Harrington', email: 'j.harrington@example.com', phone: '+44 20 7946 0958', address1: '42 Mayfair Court', city: 'London', state: 'England', zip: 'W1K 1AA', country: 'United Kingdom' },
      trackingNumber: 'DHL9928374655', carrier: 'DHL',
      createdAt: new Date('2024-04-03'), updatedAt: new Date('2024-04-04'),
      items: { create: [
        { productId: victus.id,  name: 'HP Victus Gaming Laptop',  image: '/assets/victuslaptop.png',    price: 1799, quantity: 1, sku: 'VICTUS-SLV-512' },
        { productId: headset.id, name: 'Elite Gaming Headset Pro',  image: '/assets/gamingheadphone.png', price: 1799, quantity: 1, sku: 'APEX-BLK' },
      ]},
    },
  })

  await prisma.order.upsert({
    where:  { orderNumber: '#EB-2024-00140' },
    update: {},
    create: {
      orderNumber: '#EB-2024-00140', customerId: cust3.id,
      customerName: 'Sofia Blanc', customerEmail: 'sofia.b@example.com',
      subtotal: 2699, shipping: 0, tax: 216, total: 2915,
      status: OrderStatus.processing, paymentStatus: PaymentStatus.paid,
      paymentMethod: 'Apple Pay',
      shippingAddress: { fullName: 'Sofia Blanc', email: 'sofia.b@example.com', phone: '+33 1 40 00 00 00', address1: '8 Rue de Rivoli', city: 'Paris', state: 'Île-de-France', zip: '75001', country: 'France' },
      createdAt: new Date('2024-04-05'), updatedAt: new Date('2024-04-05'),
      items: { create: [{ productId: speakers.id, name: 'Dual Tower Speaker System', image: '/assets/doublespeaker.png', price: 2699, quantity: 1, sku: 'RESON-BLK' }] },
    },
  })

  await prisma.order.upsert({
    where:  { orderNumber: '#EB-2024-00139' },
    update: {},
    create: {
      orderNumber: '#EB-2024-00139', customerId: cust4.id,
      customerName: 'Kenji Watanabe', customerEmail: 'k.watanabe@example.com',
      subtotal: 2199, shipping: 0, tax: 176, total: 2375,
      status: OrderStatus.pending, paymentStatus: PaymentStatus.pending,
      paymentMethod: 'PayPal',
      shippingAddress: { fullName: 'Kenji Watanabe', email: 'k.watanabe@example.com', phone: '+81 3 1234 5678', address1: '3-1 Marunouchi', city: 'Tokyo', state: 'Tokyo', zip: '100-0005', country: 'Japan' },
      createdAt: new Date('2024-04-06'), updatedAt: new Date('2024-04-06'),
      items: { create: [{ productId: s22ultra.id, name: 'Samsung Galaxy S22 Ultra', image: '/assets/s22.png', price: 2199, quantity: 1, sku: 'SAM-S22U-MAIN' }] },
    },
  })

  await prisma.order.upsert({
    where:  { orderNumber: '#EB-2024-00138' },
    update: {},
    create: {
      orderNumber: '#EB-2024-00138', customerId: cust1.id,
      customerName: 'Alexandra Mitchell', customerEmail: 'alex.mitchell@example.com',
      subtotal: 898, shipping: 0, tax: 72, total: 970,
      status: OrderStatus.delivered, paymentStatus: PaymentStatus.paid,
      paymentMethod: 'Visa •••• 4242',
      shippingAddress: { fullName: 'Alexandra Mitchell', email: 'alex@example.com', phone: '+1 555 0101', address1: '142 Park Avenue', city: 'New York', state: 'NY', zip: '10022', country: 'United States' },
      createdAt: new Date('2024-03-20'), updatedAt: new Date('2024-03-24'),
      items: { create: [{ productId: earbuds.id, name: 'Apex Wireless Earbuds Pro', image: '/assets/gamingheadphone.png', price: 449, quantity: 2, sku: 'APEX-EARBUDS-MAIN' }] },
    },
  })

  console.log('✓ Orders seeded')

  // ─── Coupons ───────────────────────────────────────────────────────────────

  await Promise.all([
    prisma.coupon.upsert({ where: { code: 'LUXURY10'  }, update: {}, create: { code: 'LUXURY10',  type: CouponType.percentage,    value: 10, usageLimit: 500, usageCount: 142, status: CouponStatus.active,  createdAt: new Date('2024-01-01') } }),
    prisma.coupon.upsert({ where: { code: 'WELCOME20' }, update: {}, create: { code: 'WELCOME20', type: CouponType.percentage,    value: 20, minOrderValue: 500, usageLimit: 1000, usageCount: 310, status: CouponStatus.active, createdAt: new Date('2024-01-01') } }),
    prisma.coupon.upsert({ where: { code: 'VIP15'     }, update: {}, create: { code: 'VIP15',     type: CouponType.percentage,    value: 15, usageLimit: 100, usageCount: 100, status: CouponStatus.expired, expiryDate: new Date('2024-03-31'), createdAt: new Date('2024-01-15') } }),
    prisma.coupon.upsert({ where: { code: 'FREESHIP'  }, update: {}, create: { code: 'FREESHIP',  type: CouponType.free_shipping, value: 0,  minOrderValue: 200, usageLimit: 200, usageCount: 78, status: CouponStatus.active, createdAt: new Date('2024-02-01') } }),
  ])

  console.log('✓ Coupons seeded')
  console.log('\n✅ Database seeded successfully')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
