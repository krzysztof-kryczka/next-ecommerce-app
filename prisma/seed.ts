
import { PrismaClient } from '../src/generated/prisma/index.js'
const prisma = new PrismaClient()

async function main() {
   console.log('🌱 Seeding database...')

   const brands = [
      { name: 'ROG', logo: 'https://i.ibb.co/CpZbpF00/ROG-Logo.png' },
      { name: 'Logitech', logo: 'https://i.ibb.co/W4pW9rJC/Logitech-Logo.png' },
      { name: 'JBL', logo: 'https://i.ibb.co/ZRyjSD0B/JBL-Logo.png' },
      { name: 'AOC', logo: 'https://i.ibb.co/RG0xWNr2/AOC-Logo.png' },
      { name: 'Razer', logo: 'https://i.ibb.co/whLmR3Xb/Razer-Logo.png' },
      { name: 'Rexus', logo: 'https://i.ibb.co/4wJBzRr2/Rexus-Logo.png' },
   ]
   const savedBrands = await Promise.all(brands.map(brand => prisma.brand.create({ data: brand })))
   const brandMap = new Map(savedBrands.map(brand => [brand.name, brand.id]))

   console.log('✅ Brands seeded successfully!')

   const categories = [
      {
         name: 'Webcam',
         description:
            'Stay connected like never before with our high-quality webcams. From crystal-clear video calls to professional streaming, experience reliability and sharp resolution, no matter where you are. Communicate, share, and create with ease.',
         image: 'https://i.ibb.co/TMk5GXSS/c922-gallery-3.webp',
         exploreInfo: 'Upgrade your video calls and streaming sessions. Explore webcams that keep you connected!',
      },
      {
         name: 'Keyboard',
         description:
            "Unlock the joy of effortless typing with our ergonomic keyboards, designed for speed and comfort. Whether you're working, gaming, or simply browsing, our keyboards ensure precision and durability with every keystroke. Make every press count.",
         image: 'https://i.ibb.co/HL3MnhBX/K502-RGB-5.webp',
         exploreInfo:
            'Find the perfect keyboard that matches your style and performance. Start your typing journey today!',
      },
      {
         name: 'Headphone',
         description:
            'Immerse yourself in sound with our premium headphones. Featuring noise cancellation, rich acoustics, and comfortable designs, they transform every listen into a captivating experience. Perfect for music lovers, gamers, or anyone seeking peace in sound.',
         image: 'https://i.ibb.co/1t7PQtwj/H260-W-1.png',
         exploreInfo: 'Dive into immersive soundscapes with premium headphones. Experience audio like never before!',
      },
      {
         name: 'Monitor',
         description:
            'Experience stunning visuals and seamless performance with our cutting-edge monitors. From ultra-wide displays to 4K resolutions, discover unparalleled clarity and vibrant colors that elevate your viewing experience. Perfect for work, gaming, or entertainment.',
         image: 'https://i.ibb.co/5Xvy2znL/h732.png',
         exploreInfo:
            'Discover the latest monitors tailored to your needs. Explore now and redefine your display experience!',
      },
      {
         name: 'Mouse',
         description:
            'Take control of precision with our advanced mice, featuring ergonomic designs and state-of-the-art tracking technologies. Designed for gamers, professionals, and casual users, these mice offer comfort and accuracy that keep you ahead.',
         image: 'https://i.ibb.co/7xTM9V31/Redragon-EISAK1-NGM916-PRO49-GWirelessgamingmouse-4-450x450.webp',
         exploreInfo: 'Take your control to the next level with our advanced mice. Shop now for precision and comfort!',
      },
   ]

   const savedCategories = await Promise.all(categories.map(category => prisma.category.create({ data: category })))
   const categoryMap = new Map(savedCategories.map(category => [category.name, category.id]))

   console.log('✅ Categories seeded successfully!')

   const products = [
      // Mouse (6 produktów)
      {
         name: 'Logitech G502 Hero',
         description:
            'The Logitech G502 Hero is one of the best gaming mice on the market, featuring a high-performance HERO 25K sensor for ultra-precise tracking. It offers customizable weights, 11 programmable buttons, and an ergonomic design that fits perfectly in your hand. The LIGHTSYNC RGB system allows full personalization, making it a top choice for gamers seeking accuracy and comfort.',
         price: 34.99,
         stock: 50,
         imageUrl: [
            'https://i.ibb.co/Z65vHnFb/g502-front.webp',
            'https://i.ibb.co/RkNWcn3B/g502-side.webp',
            'https://i.ibb.co/23LBjqjh/g502-back.webp',
         ],
         categoryId: categoryMap.get('Mouse'),
         brandId: brandMap.get('Logitech'),
      },
      {
         name: 'Razer DeathAdder V2',
         description:
            'The Razer DeathAdder V2 is an ergonomic gaming mouse designed for ultimate precision and comfort. Equipped with the ultra-fast Razer Optical Switches, a high-performance 20,000 DPI sensor, and Speedflex cable for smoother movements, it delivers seamless accuracy in every click. The sleek design ensures a perfect grip, making it an excellent choice for both casual and competitive gamers.',
         price: 49.99,
         stock: 30,
         imageUrl: [
            'https://i.ibb.co/GfpBmyhn/Razer-Death-Adder-front.webp',
            'https://i.ibb.co/v43jg3Y4/Razer-Death-Adder-side.webp',
            'https://i.ibb.co/XrbYL8cb/Razer-Death-Adder-back.webp',
         ],
         categoryId: savedCategories.find(category => category.name === 'Mouse')?.id,
         brandId: brandMap.get('Razer'),
      },
      {
         name: 'Logitech MX Master 3',
         description:
            'A premium productivity mouse featuring a high-precision Darkfield 4000 DPI sensor, ergonomic sculpted shape, and ultra-smooth electromagnetic scroll wheel. Ideal for professionals who need precision and comfort for long hours of work.',
         price: 99.99,
         stock: 25,
         imageUrl: [
            'https://i.ibb.co/Y5TSNpq/Logitech-mx-master-3-front.webp',
            'https://i.ibb.co/RTCbtD7q/Logitech-mx-master-3-side.webp',
            'https://i.ibb.co/zVgp83Fv/Logitech-mx-master-3-back.webp',
         ],
         categoryId: categoryMap.get('Mouse'),
         brandId: brandMap.get('Logitech'),
      },
      {
         name: 'AOC GM500',
         description:
            'The AOC GM500 Gaming Mouse features a high-performance 16,000 DPI optical sensor with customizable RGB lighting and ultra-durable mechanical switches for fast response times. Built for comfort, it ensures a precise grip for competitive gaming.',
         price: 49.99,
         stock: 50,
         imageUrl: [
            'https://i.ibb.co/7N4X6V37/AOC-GM500-front.png',
            'https://i.ibb.co/XZrPK0yS/AOC-GM500-side.png',
            'https://i.ibb.co/4R8cWhbn/AOC-GM500-back.png',
         ],
         categoryId: categoryMap.get('Mouse'),
         brandId: brandMap.get('AOC'),
      },
      {
         name: 'Razer Viper Ultimate',
         description:
            'The Razer Viper Ultimate is an ultra-lightweight wireless gaming mouse powered by Razer’s HyperSpeed technology. Equipped with the cutting-edge Focus+ 20,000 DPI optical sensor and Razer Optical Mouse Switches, it delivers lightning-fast response times and extreme accuracy.',
         price: 139.99,
         stock: 30,
         imageUrl: [
            'https://i.ibb.co/LXy5YYGr/Razer-Viper-Ultimate-front.jpg',
            'https://i.ibb.co/qLwrHyGq/Razer-Viper-Ultimate-side.jpg',
            ' https://i.ibb.co/tpMQYxC3/Razer-Viper-Ultimate-back.jpg',
         ],
         categoryId: categoryMap.get('Mouse'),
         brandId: brandMap.get('Razer'),
      },
      {
         name: 'Rexus Xierra 100',
         description:
            'The Rexus Xierra 100 is a lightweight gaming mouse with a high-speed 12,000 DPI optical sensor, ergonomic shape, and customizable RGB lighting. It offers responsive clicks and a durable build, perfect for fast-paced gaming.',
         price: 39.99,
         stock: 50,
         imageUrl: [
            'https://i.ibb.co/svgpWMGf/Rexus-Xierra-100-front.jpg',
            'https://i.ibb.co/8LKvFJd3/Rexus-Xierra-100-side.jpg',
            'https://i.ibb.co/tTtFV8M4/Rexus-Xierra-100-back.jpg',
         ],
         categoryId: categoryMap.get('Mouse'),
         brandId: brandMap.get('Rexus'),
      },

      // Monitor (5 produktów)
      {
         name: 'ROG Swift PG259QN',
         description:
            'The ROG Swift PG259QN is a cutting-edge esports gaming monitor featuring a blazing-fast 360Hz refresh rate and 1ms response time for ultra-smooth performance. Equipped with an IPS panel and HDR support, it delivers stunning visuals while keeping up with intense action.',
         price: 599.99,
         stock: 15,
         imageUrl: [
            'https://i.ibb.co/4w32dH5F/ROG-Swift-PG259-QN-front.png',
            'https://i.ibb.co/whszfJPc/ROG-Swift-PG259-QN-side.png',
            'https://i.ibb.co/YB8y0D6x/ROG-Swift-PG259-QN-back.png',
         ],
         categoryId: categoryMap.get('Monitor'),
         brandId: brandMap.get('ROG'),
      },
      {
         name: 'Logitech L27Q',
         description:
            'The Logitech L27Q offers a high-resolution 2560x1440 IPS panel with vibrant colors and smooth 165Hz refresh rate. Designed for professionals and gamers alike, it ensures immersive visuals with ultra-wide viewing angles.',
         price: 299.99,
         stock: 20,
         imageUrl: [
            'https://i.ibb.co/rGyPt6qB/Logitech-L27-Q-front.jpg',
            'https://i.ibb.co/Q7N2p0hw/Logitech-L27-Q-side.jpg',
            'https://i.ibb.co/LdtvVxqj/Logitech-L27-Q-back.jpg',
         ],
         categoryId: categoryMap.get('Monitor'),
         brandId: brandMap.get('Logitech'),
      },
      {
         name: 'AOC C32G2ZE',
         description:
            'The AOC C32G2ZE is a curved gaming monitor with a 240Hz refresh rate and ultra-responsive 0.5ms response time. The VA panel delivers deep blacks and vibrant colors, making it perfect for immersive gameplay.',
         price: 349.99,
         stock: 25,
         imageUrl: [
            'https://i.ibb.co/XZbw6KL8/AOC-C32-G2-ZE-front.webp',
            'https://i.ibb.co/fYSvrMR0/AOC-C32-G2-ZE-side.webp',
            'https://i.ibb.co/Kx1N897b/AOC-C32-G2-ZE-back.webp',
         ],
         categoryId: categoryMap.get('Monitor'),
         brandId: brandMap.get('AOC'),
      },
      {
         name: 'Razer Raptor 27',
         description:
            'The Razer Raptor 27 is a premium 144Hz gaming monitor with HDR400 certification and an ultra-thin aluminum chassis. Featuring a 2560x1440 resolution, 95% DCI-P3 color accuracy, and adjustable RGB lighting, it blends performance with aesthetics.',
         price: 699.99,
         stock: 10,
         imageUrl: [
            'https://i.ibb.co/ksLYQDmq/Razer-Raptor-27-front.webp',
            'https://i.ibb.co/6J1qxV46/Razer-Raptor-27-side.webp',
            'https://i.ibb.co/DHPGRVVd/Razer-Raptor-27-back.webp',
         ],
         categoryId: categoryMap.get('Monitor'),
         brandId: brandMap.get('Razer'),
      },
      {
         name: 'AOC AGON AG274QXM',
         description:
            'The AOC AGON PRO AG274QXM is a 27-inch high-end gaming monitor featuring a stunning Mini-LED panel with QHD resolution (2560x1440). With a 170Hz refresh rate, VESA DisplayHDR 1000 certification, and Adaptive Sync, it delivers breathtaking visuals, deep contrast, and ultra-smooth gameplay for competitive gamers.',
         price: 749.99,
         stock: 12,
         imageUrl: [
            'https://i.ibb.co/N2fF8GxL/AOC-AGON-PRO-AG274-QXM-front.png',
            'https://i.ibb.co/h1hRPJms/AOC-AGON-PRO-AG274-QXM-side.png',
            'https://i.ibb.co/jZ4wnZ6n/AOC-AGON-PRO-AG274-QXM-back.png',
         ],
         categoryId: categoryMap.get('Monitor'),
         brandId: brandMap.get('AOC'),
      },

      // Headphone (6 produktów)
      {
         name: 'ROG Delta S',
         description:
            'The ROG Delta S is an advanced gaming headset featuring Hi-Res ESS 9281 Quad DAC, AI-powered noise cancellation, and lightweight comfort. With customizable Aura Sync RGB lighting and crystal-clear audio, it’s perfect for competitive gamers who demand precision.',
         price: 199.99,
         stock: 30,
         imageUrl: [
            'https://i.ibb.co/rR4T8hQF/ROG-Delta-S-front.webp',
            'https://i.ibb.co/TMLKb52n/ROG-Delta-S-side.webp',
            'https://i.ibb.co/C3NWV77G/ROG-Delta-S-back.webp',
         ],
         categoryId: categoryMap.get('Headphone'),
         brandId: brandMap.get('ROG'),
      },
      {
         name: 'Logitech G Pro X Wireless',
         description:
            'The Logitech G Pro X Wireless delivers professional-grade audio with BLUE VO!CE technology and 50mm precision drivers. With ultra-low latency wireless connectivity and memory foam ear cushions, it ensures supreme comfort for marathon gaming sessions.',
         price: 229.99,
         stock: 20,
         imageUrl: [
            'https://i.ibb.co/B2smxtXt/Logitech-G-Pro-X-Wireless-front.webp',
            'https://i.ibb.co/jxTnmxm/Logitech-G-Pro-X-Wireless-side.webp',
            'https://i.ibb.co/LD8nLGpk/Logitech-G-Pro-X-Wireless-back.webp',
         ],
         categoryId: categoryMap.get('Headphone'),
         brandId: brandMap.get('Logitech'),
      },
      {
         name: 'JBL Quantum One',
         description:
            'The JBL Quantum One is an immersive gaming headset with QuantumSPHERE 360 spatial surround sound, active noise cancellation, and premium Hi-Res audio. Designed for competitive gamers, it delivers unparalleled positional accuracy and deep bass.',
         price: 249.99,
         stock: 25,
         imageUrl: [
            'https://i.ibb.co/YBrxP0Jb/JBL-Quantum-One-front.png',
            'https://i.ibb.co/BVBqffSc/JBL-Quantum-One-side.png',
            'https://i.ibb.co/whXWdkwH/JBL-Quantum-One-back.png',
         ],
         categoryId: categoryMap.get('Headphone'),
         brandId: brandMap.get('JBL'),
      },
      {
         name: 'AOC GH300 Headset',
         description:
            'The AOC GH300 is a high-quality gaming headset with 7.1 surround sound, deep bass enhancement, and a detachable noise-canceling microphone. Built for comfort, it provides immersive audio for FPS and action games.',
         price: 129.99,
         stock: 40,
         imageUrl: [
            'https://i.ibb.co/KzD4rct8/AOC-GH300-Gaming-Headset-front.png',
            'https://i.ibb.co/rRry25YF/AOC-GH300-Gaming-Headset-side.png',
            'https://i.ibb.co/YBc7zhgq/AOC-GH300-Gaming-Headset-back.png',
         ],
         categoryId: categoryMap.get('Headphone'),
         brandId: brandMap.get('AOC'),
      },
      {
         name: 'Razer BlackShark V2 Pro',
         description:
            'The Razer BlackShark V2 Pro features advanced THX Spatial Audio, titanium-coated 50mm drivers, and ultra-lightweight comfort. With a detachable supercardioid microphone and breathable memory foam earcups, it delivers crystal-clear voice and supreme sound quality.',
         price: 179.99,
         stock: 35,
         imageUrl: [
            'https://i.ibb.co/9ktXbLDg/Razer-Black-Shark-V2-Pro-front.webp',
            'https://i.ibb.co/9MMyzYK/Razer-Black-Shark-V2-Pro-side.webp',
            'https://i.ibb.co/Kx8fzLkv/Razer-Black-Shark-V2-Pro-back.webp',
         ],
         categoryId: categoryMap.get('Headphone'),
         brandId: brandMap.get('Razer'),
      },
      {
         name: 'Rexus Daxa TS1',
         description:
            'The Rexus Daxa TS1 is a high-performance gaming headset with ultra-clear 7.1 surround sound, deep bass enhancement, and lightweight ergonomic design. Featuring noise-isolating earcups and a detachable high-precision microphone, it ensures premium audio quality.',
         price: 119.99,
         stock: 50,
         imageUrl: [
            'https://i.ibb.co/k6gzMkGg/Rexus-Daxa-TS1-front.webp',
            'https://i.ibb.co/CKpzz15T/Rexus-Daxa-TS1-side.webp',
            'https://i.ibb.co/WW9Y7qFc/Rexus-Daxa-TS1-back.webp',
         ],
         categoryId: categoryMap.get('Headphone'),
         brandId: brandMap.get('Rexus'),
      },

      // Keyboard (9 produktów)
      {
         name: 'ROG Strix Scope RX',
         description:
            'The ROG Strix Scope RX is a premium mechanical gaming keyboard equipped with RX optical switches for ultra-fast actuation. Featuring a durable aluminum top plate, RGB Aura Sync lighting, and a stealth key for instant privacy mode, this keyboard is built for competitive play.',
         price: 149.99,
         stock: 30,
         imageUrl: [
            'https://i.ibb.co/WWZVRmfk/ROG-Strix-Scope-RX-side.png',
            'https://i.ibb.co/gMKvpPX0/ROG-Strix-Scope-RX-front.png',
            'https://i.ibb.co/sS9Rp0X/ROG-Strix-Scope-RX-back.png',
         ],
         categoryId: categoryMap.get('Keyboard'),
         brandId: brandMap.get('ROG'),
      },
      {
         name: 'Logitech G915 Lightspeed',
         description:
            'The Logitech G915 TKL is a compact wireless mechanical keyboard featuring Lightspeed technology for ultra-fast response times. Equipped with low-profile GL switches, RGB LightSync customization, and a sleek aluminum frame, it delivers precision with a modern design.',
         price: 179.99,
         stock: 25,
         imageUrl: [
            'https://i.ibb.co/bg6Z1dZW/Logitech-G915-TKL-Lightspeed-front.webp',
            'https://i.ibb.co/S4x4ZMYc/Logitech-G915-TKL-Lightspeed-side.webp',
            'https://i.ibb.co/x8LcJY8X/Logitech-G915-TKL-Lightspeed-back.webp',
         ],
         categoryId: categoryMap.get('Keyboard'),
         brandId: brandMap.get('Logitech'),
      },
      {
         name: 'AOC GK500 RGB',
         description:
            'The AOC GK500 is a mechanical keyboard built for gamers, featuring customizable RGB lighting, programmable macro keys, and responsive mechanical switches. With a detachable wrist rest for comfort and dedicated media controls, it enhances both work and play.',
         price: 129.99,
         stock: 35,
         imageUrl: [
            'https://i.ibb.co/YFWpHVLJ/AOC-GK500-front.png',
            'https://i.ibb.co/Xx06spNQ/AOC-GK500-side.png',
            'https://i.ibb.co/GQxH3vhp/AOC-GK500-back.png',
         ],
         categoryId: categoryMap.get('Keyboard'),
         brandId: brandMap.get('AOC'),
      },
      {
         name: 'Razer Huntsman Mini',
         description:
            'The Razer Huntsman Mini is an ultra-compact 60% mechanical keyboard with lightning-fast optical switches, onboard memory for custom profiles, and a durable PBT keycap design. Perfect for minimalist setups and pro gamers seeking efficiency.',
         price: 129.99,
         stock: 50,
         imageUrl: [
            'https://i.ibb.co/BvmQFDk/Razer-Huntsman-Mini-front.webp',
            'https://i.ibb.co/0yn1WLnq/Razer-Huntsman-Mini-side.webp',
            'https://i.ibb.co/ZzL3ZM3s/Razer-Huntsman-Mini-back.webp',
         ],
         categoryId: categoryMap.get('Keyboard'),
         brandId: brandMap.get('Razer'),
      },
      {
         name: 'Rexus Daxa M100',
         description:
            'The Rexus Daxa M100 is a versatile mechanical keyboard featuring hot-swappable switches, customizable RGB lighting, and a premium aluminum frame. Engineered for gaming and productivity, its ergonomic build ensures precision typing with lasting durability.',
         price: 109.99,
         stock: 40,
         imageUrl: [
            'https://i.ibb.co/PvcyfM1j/Rexus-Daxa-M100-X-front.webp',
            'https://i.ibb.co/vvznbBfM/Rexus-Daxa-M100-X-side.webp',
            'https://i.ibb.co/pFwVSzV/Rexus-Daxa-M100-X-back.webp',
         ],
         categoryId: categoryMap.get('Keyboard'),
         brandId: brandMap.get('Rexus'),
      },
      {
         name: 'ROG Falchion Wireless',
         description:
            'The ROG Falchion Wireless is a compact 65% keyboard with dual-mode connectivity, interactive touch panel, and gaming-grade mechanical switches. It’s built for precision with a protective cover and long battery life for extended sessions.',
         price: 159.99,
         stock: 20,
         imageUrl: [
            'https://i.ibb.co/tTPrXpfY/AC-SL1500-front.jpg',
            'https://i.ibb.co/Fb2rgGP8/C-SL1500-side.jpg',
            'https://i.ibb.co/cSFhGJjz/AC-SL1500-back.jpg',
         ],
         categoryId: categoryMap.get('Keyboard'),
         brandId: brandMap.get('ROG'),
      },
      {
         name: 'Logitech K780 Multi',
         description:
            'The Logitech K780 is a multi-device wireless keyboard designed for seamless switching between computers, tablets, and smartphones. Featuring quiet membrane keys, ergonomic design, and full compatibility with Windows, macOS, iOS, and Android, it’s perfect for professionals.',
         price: 89.99,
         stock: 45,
         imageUrl: [
            'https://i.ibb.co/TDXr16Fv/k780-gallery-speckled-uk-wide-2-front.webp',
            'https://i.ibb.co/N6H7BsR4/k780-gallery-speckled-uk-wide-2-side.webp',
            'https://i.ibb.co/r2spHwhM/k780-gallery-speckled-uk-wide-2-back.webp',
         ],
         categoryId: categoryMap.get('Keyboard'),
         brandId: brandMap.get('Logitech'),
      },
      {
         name: 'AOC GK700 TKL',
         description:
            'The AOC GK700 is an ultra-responsive tenkeyless mechanical keyboard, built with high-speed switches and customizable RGB lighting. Its compact form factor is ideal for esports players who need precision without the bulk.',
         price: 139.99,
         stock: 22,
         imageUrl: [
            'https://i.ibb.co/7JhBchP6/AOC-GK700-TKL-front.jpg',
            'https://i.ibb.co/G48Gz45c/AOC-GK700-TKL-side.jpg',
            'https://i.ibb.co/tpZjjFzK/AOC-GK700-TKL-back.jpg',
         ],
         categoryId: categoryMap.get('Keyboard'),
         brandId: brandMap.get('AOC'),
      },
      {
         name: 'Razer BlackWidow V4 Pro',
         description:
            'The Razer BlackWidow V4 Pro is an elite gaming keyboard with Razer Green switches, dedicated macro keys, and an extended wrist rest for ergonomic comfort. With Chroma RGB lighting and full programmability, it’s the ultimate choice for gaming setups.',
         price: 199.99,
         stock: 15,
         imageUrl: [
            'https://i.ibb.co/xq0NT22Q/Razer-Black-Widow-V4-Pro-front.webp',
            'https://i.ibb.co/nNhJJTcR/Razer-Black-Widow-V4-Pro-side.webp',
            'https://i.ibb.co/c4G68xf/Razer-Black-Widow-V4-Pro-back.webp',
         ],
         categoryId: categoryMap.get('Keyboard'),
         brandId: brandMap.get('Razer'),
      },

      // Webcam (5 produktów)
      {
         name: 'ROG Eye S',
         description:
            'The ROG Eye S is a premium webcam designed for gamers and streamers, featuring Full HD 1080p resolution at 60FPS, AI-powered noise cancellation, and adaptive image enhancement for crystal-clear visuals in any lighting condition.',
         price: 149.99,
         stock: 30,
         imageUrl: [
            'https://i.ibb.co/0yhff6GZ/ROG-Eye-S-front.png',
            'https://i.ibb.co/7tMjrp4B/ROG-Eye-S-side.png',
            'https://i.ibb.co/R4SpNgVD/ROG-Eye-S-back.png',
         ],
         categoryId: categoryMap.get('Webcam'),
         brandId: brandMap.get('ROG'),
      },
      {
         name: 'Logitech Brio 4K',
         description:
            'The Logitech Brio 4K webcam delivers ultra-sharp video quality with HDR support, offering advanced facial recognition and autofocus technology. Perfect for professional meetings and high-end streaming.',
         price: 199.99,
         stock: 20,
         imageUrl: [
            'https://i.ibb.co/gLWB4tng/brio-stream-front.webp',
            'https://i.ibb.co/bjwt7LJz/brio-stream-side.webp',
            'https://i.ibb.co/bMmRjBYF/brio-stream-back.webp',
         ],
         categoryId: categoryMap.get('Webcam'),
         brandId: brandMap.get('Logitech'),
      },
      {
         name: 'Logitech StreamCam 1080',
         description:
            'The Logitech StreamCam 1080 is a high-performance streaming webcam featuring a 1080p resolution at 60FPS, auto-light correction, and AI-driven background blur for professional-grade video calls and content creation.',
         price: 99.99,
         stock: 40,
         imageUrl: [
            'https://i.ibb.co/7d36Bf4z/Logitech-Stream-Cam-front.webp',
            'https://i.ibb.co/ML6bHv8/Logitech-Stream-Cam-side.webp',
            'https://i.ibb.co/DfPkDws5/Logitech-Stream-Cam-back.webp',
         ],
         categoryId: categoryMap.get('Webcam'),
         brandId: brandMap.get('Logitech'),
      },
      {
         name: 'Razer Kiyo Pro',
         description:
            'The Razer Kiyo Pro is a premium streaming webcam with an adaptive light sensor and ultra-sensitive HDR support. Featuring uncompressed 1080p 60FPS video and wide-angle lens, it’s perfect for professional streams and video conferencing.',
         price: 169.99,
         stock: 28,
         imageUrl: [
            'https://i.ibb.co/5hhFFJ5y/Razer-Kiyo-Pro-front.webp',
            'https://i.ibb.co/C37cQDSs/Razer-Kiyo-Pro-side.webp',
            'https://i.ibb.co/rGK9Ppm2/Razer-Kiyo-Pro-back.webp',
         ],
         categoryId: categoryMap.get('Webcam'),
         brandId: brandMap.get('Razer'),
      },
      {
         name: 'Logitech C920 HD Pro',
         description:
            'The Logitech C920 HD Pro is a trusted classic, delivering Full HD 1080p video with built-in dual stereo microphones. With auto-light correction and seamless compatibility across platforms, it remains a top choice for professionals and streamers alike.',
         price: 99.99,
         stock: 45,
         imageUrl: [
            'https://i.ibb.co/nM6vv5Ch/c920-front.webp',
            'https://i.ibb.co/CKYtfCGW/c920-side.webp',
            'https://i.ibb.co/Q3YBthv8/c920-back.webp',
         ],
         categoryId: categoryMap.get('Webcam'),
         brandId: brandMap.get('Logitech'),
      },
   ]

   await prisma.product.createMany({ data: products })

   console.log('✅ Products seeded successfully!')

   const user1 = await prisma.user.create({
      data: {
         email: 'user1@example.com',
         name: 'Jan Kowalski',
         password: '$2b$10$KzMlDEUBv7QriGiBs9y1SuPEsuIg8OTUmLsb7cGdCYEQK40.G29z6',
         phone: '123456789',
         country: 'Polska',
      },
   })

   await prisma.address.createMany({
      data: [
         {
            userId: user1.id,
            country: 'Polska',
            province: 'Mazowieckie',
            city: 'Warszawa',
            postalCode: '00-001',
            addressLine: 'ul. Marszałkowska 1',
            isMain: false,
         },
         {
            userId: user1.id,
            country: 'Polska',
            province: 'Śląskie',
            city: 'Katowice',
            postalCode: '40-001',
            addressLine: 'ul. Chorzowska 10',
            isMain: true,
         },
      ],
   })

   console.log('✅ Users with addresses seeded successfully!')

   console.log('✅ Seeding complete!')
}

main()
   .catch(e => {
      console.error('Error while seeding database:', e)
      process.exit(1)
   })
   .finally(async () => {
      await prisma.$disconnect()
   })
